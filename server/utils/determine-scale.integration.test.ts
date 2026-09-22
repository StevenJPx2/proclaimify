import { describe, expect, it, vi } from "vitest";
import { TypeSafeClient } from "@typesafe-ai/sdk";
import { determineScale } from "./determine-scale";

describe("determineScale integration", () => {
  it("sends stanza JSON through the TypeSafe SDK and returns its choice", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>(async (_input, init) => {
      expect(JSON.parse(String(init?.body))).toMatchObject({
        state: {
          verse1: ["C F", "Am G"],
          chorus1: ["F C", "G C"],
        },
        questions: {
          root: {
            type: "choice",
            criteria: expect.objectContaining({ C: "C major key" }),
          },
        },
      });

      return new Response(
        JSON.stringify({
          model: "jev-latest",
          answers: {
            root: {
              type: "choice",
              choice: "C",
              confidence: 0.99,
              probabilities: { C: 0.99 },
            },
          },
          usage: { input_tokens: 10, output_tokens: 0 },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    });
    const client = new TypeSafeClient({ apiKey: "test-key", fetch });

    await expect(
      determineScale(
        {
          verse1: ["C F", "Am G"],
          chorus1: ["F C", "G C"],
        },
        client,
      ),
    ).resolves.toBe("C");

    expect(fetch).toHaveBeenCalledOnce();
  });

  it("returns the relative major for a genuine relative-minor progression", async () => {
    const fetch = vi.fn<typeof globalThis.fetch>(async (_input, init) => {
      const request = JSON.parse(String(init?.body));

      expect(request.state).toEqual({
        verse1: ["Gm", "Eb", "Bb", "F"],
        chorus1: ["Gm", "Eb", "Bb", "F"],
      });
      expect(request.questions.root.instructions).toContain(
        "genuine relative-minor harmony",
      );

      return new Response(
        JSON.stringify({
          model: "jev-latest",
          answers: {
            root: {
              type: "choice",
              choice: "Bb",
              confidence: 0.95,
              probabilities: { Bb: 0.95 },
            },
          },
          usage: { input_tokens: 10, output_tokens: 0 },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    });
    const client = new TypeSafeClient({ apiKey: "test-key", fetch });

    await expect(
      determineScale(
        {
          verse1: ["Gm", "Eb", "Bb", "F"],
          chorus1: ["Gm", "Eb", "Bb", "F"],
        },
        client,
      ),
    ).resolves.toBe("Bb");
  });
});
