export function findChordStepIndex(chord: string): number {
  const noteRegex = new RegExp(notePattern, "g");
  const note = chord.match(noteRegex);

  if (!note) return 0;

  return chordSteps.findIndex((val) =>
    Array.isArray(val) ? val.includes(note[0]) : val === note[0],
  );
}
