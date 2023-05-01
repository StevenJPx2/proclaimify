export type EncodedLyric = { chord?: string; lyrics: [string, string] };
export type ChordLyricFormat = {
  encodeLyrics: (lyrics: string[]) => EncodedLyric[];
  decodeLyrics: (encoded: EncodedLyric[]) => string;
};
