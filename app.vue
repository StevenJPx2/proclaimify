<script lang="ts" setup>
import { EncodedLyrics, ChordLyricFormat } from "./utils";

type ChordType = { name: string; format: ChordLyricFormat };

const scale = ref<string>();
const lyrics = ref(sampleLyrics);
const { count, inc, dec, set, reset } = useCounter();
const chordTypes: [ChordType, ChordType] = [
  { name: "Lined", format: linedChords },
  { name: "Inset", format: insetChords },
];
const fromChordFormat = ref<ChordLyricFormat>(chordTypes[0].format);
const toChordFormat = ref<ChordLyricFormat>(chordTypes[1].format);

const encodedLyrics = computed<EncodedLyrics>(() =>
  fromChordFormat.value
    .encodeLyrics((lyrics.value ?? "").split("\n"))
    .map((line) =>
      line.map((val) => ({
        ...val,
        chord: !val.chord ? undefined : transposeChord(val.chord, count.value),
      }))
    )
);

const changedLyrics = computed(() =>
  toChordFormat.value.decodeLyrics(encodedLyrics.value)
);

const getRelativeChordSpacing = (targetScale: string) => {
  if (!scale.value) return count.value;
  return findChordStepIndex(targetScale) - findChordStepIndex(scale.value);
};
</script>

<template>
  <main class="max-w-screen-lg w-full mx-auto px-3 py-8">
    <section class="flex flex-col lg:flex-row gap-5 items-center mb-6">
      <div class="
            rounded-lg
            border-4 border-primary
            py-4
            w-full
            max-w-sm
            grid
            place-items-center
          ">
        <img src="~/assets/pcfy-logo.svg" class="min-w-[100px]" />
      </div>
      <div class="grid gap-3">
        <label for="scale" class="block">
          scale
          <input class="border px-4 py-1 rounded" type="text" id="scale" v-model="scale" />
        </label>
        <label for="from-chord-format" class="block">
          from chord format
          <select v-model="fromChordFormat">
            <option v-for="chordType in chordTypes" :key="chordType.name" :value="chordType.format">
              {{ chordType.name }}
            </option>
          </select>
        </label>
        <label for="to-chord-format" class="block">
          to chord format
          <select v-model="toChordFormat">
            <option v-for="chordType in chordTypes" :key="chordType.name" :value="chordType.format">
              {{ chordType.name }}
            </option>
          </select>
        </label>
      </div>
    </section>

    <div class="flex items-center mb-4">
      <button class="btn !rounded-r-none !border-r-0" @click="dec()">-</button>
      <div class="flex">
        <input class="!border-y-none !rounded-none w-10" type="number" :value="count"
          @change="(e) => set((e.currentTarget as HTMLInputElement).valueAsNumber)" />
        <input v-if="!!scale" class="!border-l-0 !rounded-none w-10" type="type" :value="transposeChord(scale, count)"
          @input="(e) => set(getRelativeChordSpacing((e.currentTarget as HTMLInputElement).value))" />
      </div>
      <button class="btn !rounded-l-none !border-l-0" @click="inc()">+</button>
      <button class="btn ml-3" @click="reset()">0</button>
    </div>

    <div class="grid gap-4 lg:grid-cols-2 font-normal">
      <textarea class="
            border-4 border-primary
            rounded-lg
            resize-none
            h-96
            font-mono
            p-2
          " v-model="lyrics" wrap="off" />
      <p class="
            whitespace-pre
            font-mono
            overflow-scroll
            border-4 border-primary
            rounded-lg
            select-all
            h-96
            p-2
          ">
        {{ changedLyrics }}
      </p>
    </div>
    <dev-only>
      {{ scale }}
      <pre>{{ JSON.stringify(encodedLyrics, null, 2) }}</pre>
    </dev-only>
  </main>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");

body {
  font-family: "Inter", sans-serif;
  @apply text-lg;
  @apply font-semibold;
}

label,
input,
select {
  @apply text-primary;
}

input:not([type="submit"]),
select {
  @apply rounded-lg;
  @apply border-4;
  @apply border-primary;
}

.btn {
  @apply px-3;
  @apply rounded-lg;
  @apply border-4;
  @apply border-primary;
  @apply text-primary;
  @apply cursor-pointer;

  &.active {
    @apply bg-gray-200;
  }
}
</style>
