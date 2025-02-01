import type { ChordLyricFormat, EncodedLyric } from "./types";

export default <ChordLyricFormat>{
  encodeLyrics(lyrics) {
    const insetRegex = /\[.+?\]/g;
    return lyrics.map<EncodedLyric[]>((line) => {
      if (line.match(songSectionRegex)) {
        return [{ lyrics: ["", line] }];
      }

      const prospectiveLyrics = line.split(insetRegex);
      const prospectiveChords = line.match(insetRegex);

      if (!prospectiveChords) {
        return [{ lyrics: ["", prospectiveLyrics.join("")] }];
      }

      if (prospectiveLyrics.join("").trim() === "") {
        return [
          {
            lyrics: ["", ""],
            chord: Array.from(prospectiveChords)
              .join(" ")
              .replaceAll(/[\[\]]/g, ""),
          },
        ];
      }

      const lines: EncodedLyric[] = [];
      for (let cursor = 0; cursor < prospectiveChords.length; cursor++) {
        lines.push({
          lyrics: [
            cursor === 0 ? prospectiveLyrics[cursor] : "",
            prospectiveLyrics[
              Math.min(cursor + 1, prospectiveLyrics.length - 1)
            ],
          ],
          chord: prospectiveChords[cursor].replaceAll(/[\[\]]/g, ""),
        });
      }
      return lines;
    });
  },
  decodeLyrics(encoded) {
    return encoded
      .map((line) =>
        line
          .map(({ lyrics, chord }) => {
            let finalChordEmbed = "";
            if (!!chord) {
              finalChordEmbed = chord
                .trim()
                .split(" ")
                .filter((ch) => ch.trim() !== "")
                .map((ch) => `[${ch}]`)
                .join("");
            }
            return `${lyrics[0]}${finalChordEmbed}${lyrics[1]}`;
          })
          .join(""),
      )
      .join("\n");
  },
};
