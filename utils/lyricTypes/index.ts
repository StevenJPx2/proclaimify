import { Tuple } from "../types";
import type { ChordFormat } from "./types";

import linedChords from "./linedChords";
import insetChords from "./insetChords";

export function detectChordFormat(song: string): ChordFormat {
  // Regular expression to extract text within square brackets
  const bracketPattern = /\[.*?\]/g;
  const regex = new RegExp(chordRegex());
  let match;

  while ((match = bracketPattern.exec(song)) !== null) {
    // Extract the text inside the brackets
    const textInsideBrackets = match[0].slice(1, -1);

    // Split the text inside brackets into potential chords and lyrics parts
    const parts = textInsideBrackets.split(/(?=[A-Z])/);

    // Check each part with the chordRegex
    for (const part of parts) {
      if (regex.test(part)) {
        // If any part is a chord, it's likely an inset pattern
        return "Inset";
      }
    }
  }

  return "Lined";
}

export const chordTypesObj = {
  Lined: linedChords,
  Inset: insetChords,
} satisfies { [Key in ChordFormat]: ChordLyricFormat };

export type ChordTypesObj = typeof chordTypesObj;

export type ChordTypesTuple = Tuple<
  {
    [Key in ChordFormat]: { name: Key; format: ChordLyricFormat };
  }[ChordFormat]
>;

export const chordTypesTuple = [
  { name: "Lined", format: linedChords },
  { name: "Inset", format: insetChords },
] satisfies ChordTypesTuple;
