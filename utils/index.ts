import { insetChords, linedChords } from "./lyricTypes";
import {
  EncodedLyric,
  EncodedLyrics,
  ChordLyricFormat,
} from "./lyricTypes/types";

export const songSectionRegex =
  /^(intro|chorus|verse|v|bridge|tag|pre[-\s]?chorus|interlude)\s?\d*/i;
export const notePattern = "[A-G][b#]?";
export function chordRegex() {
  const altered = `(?:5|dim(5|7)?|aug5?|\\+5?|-5?)`;
  const minor = "(?:mi?n?)";
  const major = "(?:maj?|Ma?j?)";
  const majorableExt = `(?:6|7|9|11|13)`;
  const ext = `(?:4|6|7|9|11|13|6\\/9)`;
  const _mod = "(?:[b-](5|6|9|13)|[#+](4|5|9|11))";
  const mod = `(?:\\(${_mod}\\)|${_mod})`;
  const sus = "(?:sus(2|4|24|2sus4)?)";
  const add = "(?:add[b#]?(?:2|4|6|7|9|11|13))";
  const bass = `(?:\\/${notePattern})`;

  const lookahead = "(?=$| )";
  const source = `${notePattern}${`(?:${altered}|${`(?:${minor}?(?:${ext}|${major}?${majorableExt})?)` +
    `${mod}*${sus}?${mod}*${add}?`
    })`}${bass}?${lookahead}`;

  return source;
}

// custom mod to fix negative modulo
function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function findChordStepIndex(chord: string): number {
  const noteRegex = new RegExp(notePattern, "g");
  const note = chord.match(noteRegex);

  if (!note) return 0;

  return chordSteps.findIndex((val) =>
    Array.isArray(val) ? val.includes(note[0]) : val === note[0]
  );
}

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
              : transposedNote
          );
        })
        .join("/");
    })
    .join("");
}

export function makeLowerThirds(encodedLyrics: EncodedLyrics) {
  let newLyrics = "";
  const lyricArray = encodedLyrics.map((line) =>
    line.map(({ lyrics }) => lyrics.join("")).join("")
  );

  for (let lineNumber = 0; lineNumber < lyricArray.length; lineNumber++) {
    const line = lyricArray[lineNumber];
    if (songSectionRegex.test(line) || line.trim() === "") {
      newLyrics += line + "\n";
      continue;
    }
    const secondLine =
      lyricArray[Math.min(lineNumber + 1, lyricArray.length - 1)].split(" ");
    secondLine[0] = secondLine[0].toLowerCase();
    newLyrics += `${line}, ${secondLine.join(" ")}\n`;
    lineNumber++;
  }

  return newLyrics;
}

export { linedChords, insetChords };
export type { EncodedLyric, EncodedLyrics, ChordLyricFormat };
