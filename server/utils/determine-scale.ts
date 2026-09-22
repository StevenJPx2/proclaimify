import { choice, TypeSafeClient } from "@typesafe-ai/sdk";
import type { ScaleState } from "../../utils/functions/make-scale-state";

const scaleCriteria = {
  A: "A major key",
  "A#": "A sharp major key",
  Bb: "B flat major key",
  B: "B major key",
  C: "C major key",
  "C#": "C sharp major key",
  Db: "D flat major key",
  D: "D major key",
  "D#": "D sharp major key",
  Eb: "E flat major key",
  E: "E major key",
  F: "F major key",
  "F#": "F sharp major key",
  Gb: "G flat major key",
  G: "G major key",
  "G#": "G sharp major key",
  Ab: "A flat major key",
} as const;

export async function determineScale(
  state: ScaleState,
  client: Pick<TypeSafeClient, "systemOne"> = new TypeSafeClient(),
) {

  const response = await client.systemOne({
    state,
    questions: {
      root: choice(
        "The state is JSON: each key names a stanza, and each array contains " +
          "the chord string for each line in that stanza. Which note is the " +
          "the tonic and key center of the full song as a major key. For genuine " +
          "relative-minor harmony, return its relative major (the minor tonic is " +
          "scale degree 6), such as G minor -> Bb. Do not mechanically convert " +
          "modal or ambiguous progressions. Use the overall harmonic resolution, " +
          "not the root of the first chord.",
        scaleCriteria,
      ),
    },
  });

  return response.answers.root.choice;
}
