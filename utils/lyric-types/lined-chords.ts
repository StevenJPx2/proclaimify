import { songSectionRegex } from "../constants";
import type { ChordLyricFormat, EncodedLyrics } from "./types";

export default <ChordLyricFormat>{
  encodeLyrics(lyrics) {
    const encodedLyrics: EncodedLyrics = [];
    const lastLyricPos = () => encodedLyrics.length - 1;

    const testLineForChords = (line: string) => {
      const chordSectionRegex = new RegExp("\\s*?" + chordRegex + "\\s*", "g");
      const prospectiveChords = line.match(chordSectionRegex);

      const splitLines = line.split(/\s+/).filter((line) => line !== "");

      if (
        !prospectiveChords ||
        splitLines.length !== prospectiveChords.length
      ) {
        return null;
      }

      return prospectiveChords;
    };

    for (let lineNumber = 0; lineNumber < lyrics.length; lineNumber++) {
      const line = lyrics[lineNumber];

      if (!line) continue;

      const prospectiveChords = testLineForChords(line);

      if (!prospectiveChords) {
        encodedLyrics.push([{ lyrics: ["", line] }]);
        continue;
      } else {
        encodedLyrics.push([]);
      }

      let prospectiveLyric = "";

      if (lineNumber < lyrics.length - 1) {
        const nextLine = lyrics[lineNumber + 1];

        if (!nextLine) continue;

        if (testLineForChords(nextLine) || songSectionRegex.test(nextLine)) {
          encodedLyrics[lastLyricPos()]?.push({
            lyrics: ["", ""],
            chord: line,
          });
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
            prospectiveLyric
              .slice(cursorPos, prefixWhiteSpaceNumber)
              .trimStart(),
            prospectiveLyric.slice(
              cursorPos + prefixWhiteSpaceNumber,
              index === prospectiveChords.length - 1
                ? undefined
                : Math.min(
                    cursorPos +
                      prefixWhiteSpaceNumber +
                      suffixWhiteSpaceNumber +
                      chord.trim().length,
                    line.length,
                  ),
            ),
          ] as [string, string],
          chord: chord.trim(),
        };

        cursorPos += chord.length;

        encodedLyrics[lastLyricPos()]?.push(encoded);
      });

      lineNumber++;
    }

    return encodedLyrics;
  },
  decodeLyrics(encoded) {
    return encoded
      .map((line) => {
        let chordLine = "";
        const lyricLine = line.map(({ lyrics }) => lyrics.join("")).join("");
        line
          .filter(
            (value): value is { lyrics: [string, string]; chord: string } =>
              !!value.chord,
          )
          .forEach(({ lyrics, chord }) => {
            if (lyrics.join("").trim() === "") {
              chordLine += chord + "  ";
              return;
            }
            chordLine +=
              " ".repeat(lyrics[0].length) +
              chord +
              " ".repeat(Math.max(lyrics[1].length - chord.length, 0));
          });

        if (chordLine.trim() === "") return lyricLine;

        return `${chordLine}\n${lyricLine}`;
      })
      .join("\n");
  },
};
