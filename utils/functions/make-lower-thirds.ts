import { songSectionRegex } from "../constants";

export function makeLowerThirds(encodedLyrics: EncodedLyrics) {
  let newLyrics = "";

  const lyricArray = encodedLyrics.map((line) =>
    line.map(({ lyrics }) => lyrics.join("")).join(""),
  );

  for (let lineNumber = 0; lineNumber < lyricArray.length; lineNumber++) {
    const line = lyricArray[lineNumber].trim();

    if (songSectionRegex.test(line) || line === "") {
      newLyrics += line + "\n";
      continue;
    }

    const secondLine =
      lyricArray[Math.min(lineNumber + 1, lyricArray.length - 1)].split(" ");

    if (!/(Jesus|God|Yahweh|I|Him|You|He|Christ)/.test(secondLine[0])) {
      secondLine[0] = secondLine[0].toLowerCase();
    }

    const secondLineText = secondLine.join(" ").trim();

    const previousLine = (lyricArray[Math.max(lineNumber - 1, 0)] ?? "").trim();
    const thirdLine =
      lyricArray[Math.min(lineNumber + 2, lyricArray.length - 1)].trim();

    const lineWords = line.match(/(.*?)[\.\?\!,;:]+\s*$/);

    newLyrics += lineWords?.[1] ?? line;

    if (previousLine === "" && thirdLine === "") {
      // Two lines
      newLyrics += `\n${secondLineText}`;
    } else if (secondLineText !== "") {
      // Four lines
      newLyrics += `, ${secondLineText}`;
    } else {
      newLyrics += "\n";
    }

    newLyrics += "\n";

    lineNumber++;
  }

  return newLyrics;
}
