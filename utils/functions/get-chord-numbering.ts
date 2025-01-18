import { chordSteps } from "../constants";
import { mod } from "./mod";

export function getChordNumbering(scale: string) {
  const chordNumbering: Record<string, number> = {};
  let index = chordSteps.findIndex((step) =>
    Array.isArray(step) ? step.includes(scale) : step === scale,
  );

  if (index === -1) return chordNumbering;

  const indexSkips = [0, 2, 2, 1, 2, 2, 1, 2, 1];

  for (let i = 0; i < indexSkips.length; i++) {
    const skip = indexSkips[i];
    index = mod(index + skip, chordSteps.length);
    let selectedChord: string[] | string = chordSteps[index];

    if (!Array.isArray(selectedChord)) selectedChord = [selectedChord];

    for (const chord of selectedChord) {
      chordNumbering[chord] = mod(i, 7) + 1;
    }
  }

  console.log(chordNumbering);

  return chordNumbering;
}
