import { choice, TypeSafeClient } from "@typesafe-ai/sdk";
import type { ScaleState } from "../../utils/functions/make-scale-state";

const scaleCriteria = {
  A: "A natural root",
  "A#": "A sharp root",
  Bb: "B flat root",
  B: "B natural root",
  C: "C natural root",
  "C#": "C sharp root",
  Db: "D flat root",
  D: "D natural root",
  "D#": "D sharp root",
  Eb: "E flat root",
  E: "E natural root",
  F: "F natural root",
  "F#": "F sharp root",
  Gb: "G flat root",
  G: "G natural root",
  "G#": "G sharp root",
  Ab: "A flat root",
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
          "tonic and key center of the full song? Use the overall harmonic " +
          "resolution, not the root of the first chord.",
        scaleCriteria,
      ),
    },
  });

  return response.answers.root.choice;
}
