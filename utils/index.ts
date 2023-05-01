export const chordSteps: (string | [string, string])[] = [
  "A",
  ["A#", "Bb"],
  "B",
  "C",
  ["C#", "Db"],
  "D",
  ["D#", "Eb"],
  "E",
  "F",
  ["F#", "Gb"],
  "G",
  ["G#", "Ab"],
];

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
  const source = `${notePattern}${`(?:${altered}|${
    `(?:${minor}?(?:${ext}|${major}?${majorableExt})?)` +
    `${mod}*${sus}?${mod}*${add}?`
  })`}${bass}?${lookahead}`;

  return source;
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

          const index = chordSteps.findIndex((val) =>
            Array.isArray(val) ? val.includes(note[0]) : val === note[0]
          );

          const transposedNote =
            chordSteps[(increment + index) % chordSteps.length];

          return chord.replace(
            noteRegex,
            Array.isArray(transposedNote) ? transposedNote[0] : transposedNote
          );
        })
        .join("/");
    })
    .join("");
}
