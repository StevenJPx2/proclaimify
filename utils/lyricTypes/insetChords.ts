import { ChordLyricFormat } from "./types";

// TODO: algo for encoding [Bb].....[A]...... lyrics
export default <ChordLyricFormat>{
  encodeLyrics(lyrics) {
    return [];
  },
  decodeLyrics(encoded) {
    return encoded
      .map(
        ({ lyrics, chord }) =>
          `${lyrics[0]}${!!chord ? "[" + chord.trim() + "]" : ""}${lyrics[1]}`
      )
      .join("");
  },
};
