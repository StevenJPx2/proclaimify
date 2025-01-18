import { findChordStepIndex } from "./find-chord-step-index";
import { mod } from "./mod";
import { chordRegex, notePattern } from "../constants";

export function transposeChord(chords: string, increment: number): string {
  const splitChords = chords.match(new RegExp(chordRegex() + "\\s*", "g"));

  if (!splitChords) return chords;

  return Array.from(splitChords)
    .map((chordWBar) => {
      return chordWBar
        .split("/")
        .map((chord) => {
          const noteRegex = new RegExp(notePattern, "g");
          const note = chord.match(noteRegex);

          if (!note) return chord;

          const index = findChordStepIndex(note[0]);

          const transposedNote =
            chordSteps[mod(increment + index, chordSteps.length)];

          return chord.replace(
            noteRegex,
            Array.isArray(transposedNote)
              ? note[0].includes("b")
                ? transposedNote[1]
                : transposedNote[0]
              : transposedNote,
          );
        })
        .join("/");
    })
    .join("");
}
