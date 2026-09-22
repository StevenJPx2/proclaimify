import { beforeEach, describe, expect, it, vi } from "vitest";
import { determineScale } from "./determine-scale";

const systemOne = vi.fn();

describe("determineScale", () => {
  beforeEach(() => {
    systemOne.mockReset();
  });

  it("returns Jev's selected root note as the existing string contract", async () => {
    systemOne.mockResolvedValue({
      answers: { root: { choice: "Bb" } },
    });

    const state = {
      verse1: ["Bb F/A", "Eb/G Bb"],
      chorus1: ["F C", "G Bb"],
    };

    await expect(determineScale(state, { systemOne })).resolves.toBe("Bb");
    expect(systemOne).toHaveBeenCalledWith({
      state,
      questions: {
        root: {
          type: "choice",
          instructions:
            "The state is JSON: each key names a stanza, and each array contains " +
            "the chord string for each line in that stanza. Which note is the " +
            "tonic and key center of the full song? Use the overall harmonic " +
            "resolution, not the root of the first chord.",
          criteria: expect.objectContaining({
            C: "C natural root",
            Bb: "B flat root",
          }),
        },
      },
    });
  });
});
