import { describe, expect, it } from "vitest";
import { makeScaleState } from "./make-scale-state";

describe("makeScaleState", () => {
  it("groups chord strings by stanza and preserves line boundaries", () => {
    expect(
      makeScaleState([
        [{ lyrics: ["", "Verse 1"] }],
        [{ chord: "C", lyrics: ["", ""] }, { chord: "F", lyrics: ["", ""] }],
        [{ chord: "Am", lyrics: ["", ""] }],
        [{ lyrics: ["", "Chorus 1"] }],
        [{ chord: "G", lyrics: ["", ""] }, { chord: "C", lyrics: ["", ""] }],
      ]),
    ).toEqual({
      verse1: ["C F", "Am"],
      chorus1: ["G C"],
    });
  });
});
