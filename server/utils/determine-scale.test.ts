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
            "the tonic and key center of the full song as a major key. For genuine " +
            "relative-minor harmony, return its relative major (the minor tonic is " +
            "scale degree 6), such as G minor -> Bb. Do not mechanically convert " +
            "modal or ambiguous progressions. Use the overall harmonic resolution, " +
            "not the root of the first chord.",
            criteria: expect.objectContaining({
            C: "C major key",
            Bb: "B flat major key",
          }),
        },
      },
    });
  });
});
