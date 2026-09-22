import type { EncodedLyrics } from "../lyric-types/types";
import { songSectionRegex } from "../constants";

export type ScaleState = Record<string, string[]>;

function normalizeStanzaName(name: string) {
  return name.toLowerCase().replaceAll(/[^a-z0-9]/g, "");
}

function uniqueStanzaName(state: ScaleState, name: string) {
  if (!(name in state)) return name;

  let suffix = 2;

  while (`${name}${suffix}` in state) suffix++;

  return `${name}${suffix}`;
}

export function makeScaleState(encodedLyrics: EncodedLyrics): ScaleState {
  const state: ScaleState = {};
  let currentStanza = "song";

  for (const line of encodedLyrics) {
    const text = line.map(({ lyrics }) => lyrics.join("")).join("").trim();
    const sectionMatch = text.match(songSectionRegex);

    if (sectionMatch) {
      const stanzaName = normalizeStanzaName(sectionMatch[0]);
      currentStanza = uniqueStanzaName(state, stanzaName || "song");
      state[currentStanza] = [];

      continue;
    }

    const chords = line
      .flatMap(({ chord }) => (chord ? [chord.trim()] : []))
      .join(" ");

    if (!state[currentStanza]) state[currentStanza] = [];

    state[currentStanza].push(chords);
  }

  return state;
}
