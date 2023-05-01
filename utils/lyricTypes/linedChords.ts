import { ChordLyricFormat, EncodedLyric } from "./types";
// TODO: algo for decoding encoded lyrics to:
// Bb         A
// ...................
export default <ChordLyricFormat>{
  encodeLyrics(lyrics) {
    const encodedLyrics: EncodedLyric[] = [];

    for (let lineNumber = 0; lineNumber < lyrics.length; lineNumber++) {
      const line = lyrics[lineNumber];
      const regex = new RegExp(chordRegex() + "\\s*", "g");
      const prospectiveChords = line.match(regex);
      if (!prospectiveChords) {
        encodedLyrics.push({ lyrics: ["\n", line] });
        continue;
      } else {
        encodedLyrics.push({ lyrics: ["", "\n"] });
      }

      let prospectiveLyric = "";
      if (lineNumber < lyrics.length - 1) {
        const nextLine = lyrics[lineNumber + 1];
        if (
          regex.test(nextLine) ||
          /^(intro|chorus|verse|v|bridge|tag|pre[-\s]?chorus)\s?\d*/i.test(
            nextLine
          )
        ) {
          encodedLyrics.push({ lyrics: ["", ""], chord: line });
          continue;
        }
        prospectiveLyric = nextLine;
      }

      let cursorPos = 0;

      prospectiveChords.forEach((chord, index) => {
        const prefixWhiteSpaceNumber = chord.length - chord.trimStart().length;

        const encoded = {
          lyrics: [
            prospectiveLyric.slice(cursorPos, prefixWhiteSpaceNumber),
            prospectiveLyric.slice(
              cursorPos + prefixWhiteSpaceNumber,
              index === prospectiveChords.length - 1
                ? undefined
                : Math.min(cursorPos + chord.trimStart().length, line.length)
            ),
          ] as [string, string],
          chord,
        };

        cursorPos += chord.length;

        encodedLyrics.push(encoded);
      });

      lineNumber++;
    }

    return encodedLyrics;
  },
  decodeLyrics(encoded) {
    return "";
  },
};
