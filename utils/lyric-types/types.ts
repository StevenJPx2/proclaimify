export type EncodedLyric = { chord?: string; lyrics: [string, string] };
export type EncodedLyrics = EncodedLyric[][];
export type ChordLyricFormat = {
  encodeLyrics: (lyrics: string[]) => EncodedLyrics;
  decodeLyrics: (encoded: EncodedLyrics) => string;
};
export type ChordFormat = "Inset" | "Lined";
