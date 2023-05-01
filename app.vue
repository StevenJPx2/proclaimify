<script lang="ts" setup>
const sampleLyrics = `
Intro

Fm Bbm F Fm Gb F Fm Gb F Fm Fm9

Ab Eb Ebm9 Ab Eb Ebm9 F    Eb/G Ab Bbm Ab/C



Chorus

Fm9     Db Eb              Fm9     Db Eb

 I will praise Your name, and I will bless  You always

F/A     Bbm9               F Eb/G Ab Bbm7 Caug7

 I will praise Your name today

Fm9     Db Eb

 I will  sing  and shout it

Fm9     Fm7 Bb   Db Eb   C7 #9    Bbm7

 I will tell the world     about      it

F/A     Bbm9               F

 I will praise Your name today

 Eb/G Ab Bbm7 Caug

 Bb2 D Db/F7sus C Fm7 b5  B



Verse 1

Bbm9  Ab2 C Db         Bbm9   Ab2 C Db

    I made   my decision,    no turn - ing back for me, oh

Bbm9    Ab2 C Db

    All glo  - ry  I'm givin'

 Bbm9       Ab2 C Db     Cm7  Fm7 b5  B

               You're Lord   of ev'rything

 Bbm9       Ab     Db     Ab2 C

               You're Lord   of  ev'rything



Verse 2

Bbm9     Ab2 C Db          Bbm9     Ab2 C Db

    Your mer - cy's unending,    Your grace  has guarded me, oh

Bbm9   Ab2 C Db

    My Mas  - ter my Savior

 Bbm9       Ab2 C Db     Cm7  Fm7 b5  B

               You're Lord   of ev'rything

 Bbm9       Ab   Db     Ab2 C

               You're Lord of  ev'rything



Bridge

Eb/G Ab       Bbm7         Caug

     Somebody give Him the praise, give Him the praise

Give Him the praise, give Him the praise

Bbm7   Cm7

Give Him the praise

Bbm7

    Oh yeah, oh yeah, oh yeah

                           Eb/G Ab Bbm Caug

Oh yeah, oh yeah, oh, yeah



Ending

Fm Bbm F Fm Gb F    Bbm F  Fm Fm7

I  live  to praise, I praise to live

Fm Bbm F Fm Gb F

I  live  to praise

       F          Eb/G Ab   Bbm    Caug

And forever and ever I    will praise You

 Fm

           I will
`;
const lyrics = ref(sampleLyrics);
const { textarea } = useTextareaAutosize({ input: lyrics });
const { count, inc, dec, set, reset } = useCounter();

type EncodedLyric = { chord?: string; lyrics: [string, string] };
type ChordLyricFormat = {
  encodeLyrics: (lyrics: string[]) => EncodedLyric[];
  decodeLyrics: (encoded: EncodedLyric[]) => string;
};

// TODO: algo for encoding [Bb].....[A]...... lyrics
const squaredChords: ChordLyricFormat = {
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

// TODO: algo for decoding encoded lyrics to:
// Bb         A
// ...................

const linedChords: ChordLyricFormat = {
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

const encodedLyrics = computed<EncodedLyric[]>(() =>
  linedChords
    .encodeLyrics(
      (lyrics.value ?? "").split("\n").filter((line) => line.trim() !== "")
    )
    .map((val) => ({
      ...val,
      chord: !val.chord ? undefined : transposeChord(val.chord, count.value),
    }))
);

const changedLyrics = computed(() =>
  squaredChords.decodeLyrics(encodedLyrics.value)
);
</script>

<template>
  <main>
    <div class="flex items-center">
      <input
        type="number"
        :value="count"
        @change="(e) => set(parseInt((e.currentTarget as HTMLInputElement).value))"
      />
      <button class="btn" @click="dec()">-1</button>
      <button class="btn" @click="reset()">0</button>
      <button class="btn" @click="inc()">+1</button>
    </div>
    <div class="grid gap-4 grid-cols-2">
      <textarea
        class="border rounded resize-none font-mono"
        ref="textarea"
        v-model="lyrics"
      />
      <p class="whitespace-pre">{{ changedLyrics }}</p>
      <dev-only>
        <pre>{{ JSON.stringify(encodedLyrics, null, 2) }}</pre>
      </dev-only>
    </div>
  </main>
</template>

<style lang="scss">
.btn {
  @apply p-3;
  @apply rounded;
  @apply border;
  @apply bg-gray-50;
  @apply cursor-pointer;
}
</style>
