export * from "./lyricTypes";
export * from "./lyricTypes/types";
import { type EncodedLyrics } from "./lyricTypes/types";

export const songSectionRegex =
  /^[\(\[\{]?(intro|chorus|refrain|verse|v|bridge|tag|pre[-\s]?chorus|interlude|outro)\s?\d*[\)\]\}]?/i;

export const notePattern = "[A-G][b#]?";

export function chordRegex() {
  const altered = `(?:2|5|dim(5|7)?|aug5?|\\+5?|-5?)`;
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
  const source = `${notePattern}${`(?:${altered}|${
    `(?:${minor}?(?:${ext}|${major}?${majorableExt})?)` +
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
    Array.isArray(val) ? val.includes(note[0]) : val === note[0],
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
              : transposedNote,
          );
        })
        .join("/");
    })
    .join("");
}

export function makeLowerThirds(encodedLyrics: EncodedLyrics) {
  let newLyrics = "";

  const lyricArray = encodedLyrics.map((line) =>
    line.map(({ lyrics }) => lyrics.join("")).join(""),
  );

  for (let lineNumber = 0; lineNumber < lyricArray.length; lineNumber++) {
    const line = lyricArray[lineNumber].trim();

    if (songSectionRegex.test(line) || line === "") {
      newLyrics += line + "\n";
      continue;
    }

    const secondLine =
      lyricArray[Math.min(lineNumber + 1, lyricArray.length - 1)].split(" ");

    if (!/(Jesus|God|Yahweh|I|Him|You|He|Christ)/.test(secondLine[0])) {
      secondLine[0] = secondLine[0].toLowerCase();
    }

    const secondLineText = secondLine.join(" ").trim();

    const previousLine = (lyricArray[Math.max(lineNumber - 1, 0)] ?? "").trim();
    const thirdLine =
      lyricArray[Math.min(lineNumber + 2, lyricArray.length - 1)].trim();

    const lineWords = line.match(/(.*?)[\.\?\!,;:]+\s*$/);

    if (lineWords) {
      newLyrics += lineWords[1];
    } else {
      newLyrics += line;
    }

    if (previousLine === "" && thirdLine === "") {
      newLyrics += `\n${secondLineText}`;
    } else if (secondLineText !== "") {
      newLyrics += `, ${secondLineText}`;
    }

    newLyrics += "\n";

    lineNumber++;
  }

  return newLyrics;
}
