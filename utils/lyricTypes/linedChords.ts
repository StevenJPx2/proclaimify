import { ChordLyricFormat, EncodedLyrics } from "./types";
// TODO: algo for decoding encoded lyrics to:
// Bb         A
// ...................
export default <ChordLyricFormat>{
  encodeLyrics(lyrics) {
    const encodedLyrics: EncodedLyrics = [];
    let lastLyricPos = () => encodedLyrics.length - 1;

    for (let lineNumber = 0; lineNumber < lyrics.length; lineNumber++) {
      const line = lyrics[lineNumber];
      const regex = new RegExp("\\s*?" + chordRegex() + "\\s*", "g");
      const prospectiveChords = line.match(regex);
      if (!prospectiveChords) {
        encodedLyrics.push([{ lyrics: ["", line] }]);
        continue;
      } else {
        encodedLyrics.push([]);
      }

      let prospectiveLyric = "";
      if (lineNumber < lyrics.length - 1) {
        const nextLine = lyrics[lineNumber + 1];
        if (
          regex.test(nextLine) ||
          /^(intro|chorus|verse|v|bridge|tag|pre[-\s]?chorus|interlude)\s?\d*/i.test(
            nextLine
          )
        ) {
          encodedLyrics[lastLyricPos()].push({ lyrics: ["", ""], chord: line });
          continue;
        }
        prospectiveLyric = nextLine;
      }

      let cursorPos = 0;

      prospectiveChords.forEach((chord, index) => {
        const prefixWhiteSpaceNumber = chord.length - chord.trimStart().length;
        const suffixWhiteSpaceNumber = chord.length - chord.trimEnd().length;

        const encoded = {
          lyrics: [
            prospectiveLyric.slice(cursorPos, prefixWhiteSpaceNumber),
            prospectiveLyric.slice(
              cursorPos + prefixWhiteSpaceNumber,
              index === prospectiveChords.length - 1
                ? undefined
                : Math.min(
                  cursorPos +
                  prefixWhiteSpaceNumber +
                  suffixWhiteSpaceNumber +
                  chord.trim().length,
                  line.length
                )
            ),
          ] as [string, string],
          chord,
        };

        cursorPos += chord.length;

        encodedLyrics[lastLyricPos()].push(encoded);
      });

      lineNumber++;
    }

    return encodedLyrics;
  },
  decodeLyrics(encoded) {
    return "";
  },
};
