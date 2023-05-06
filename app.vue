<script lang="ts" setup>
import { EncodedLyrics, ChordLyricFormat } from "./utils";

type ChordType = { name: string; format: ChordLyricFormat };

const scale = ref<string>();
const lyrics = ref(sampleLyrics);
const { textarea } = useTextareaAutosize({ input: lyrics });
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
  <main class="max-w-screen-lg w-full mx-auto px-3">
    <section class="flex gap-5 items-center">
      <label for="scale" class="mb-3 block">
        Scale:
        <input class="border px-4 py-2 rounded" type="text" id="scale" v-model="scale" />
      </label>
      <label for="from-chord-format" class="mb-3 block">
        From Chord Format:
        <select v-model="fromChordFormat">
          <option v-for="chordType in chordTypes" :key="chordType.name" :value="chordType.format">
            {{ chordType.name }}
          </option>
        </select>
      </label>
      <label for="to-chord-format" class="mb-3 block">
        To Chord Format:
        <select v-model="toChordFormat">
          <option v-for="chordType in chordTypes" :key="chordType.name" :value="chordType.format">
            {{ chordType.name }}
          </option>
        </select>
      </label>
    </section>
    <div class="flex items-center gap-2 mb-4">
      <button class="btn" @click="dec()">-1</button>
      <div class="flex">
        <input class="border rounded-l w-8" type="number" :value="count"
          @change="(e) => set((e.currentTarget as HTMLInputElement).valueAsNumber)" />
        <input v-if="!!scale" class="border border-l-0 rounded-r w-8" type="type" :value="transposeChord(scale, count)"
          @input="(e) => set(getRelativeChordSpacing((e.currentTarget as HTMLInputElement).value))" />
      </div>
      <button class="btn" @click="inc()">+1</button>
      <button class="btn ml-3" @click="reset()">0</button>
    </div>
    <div class="grid gap-4 lg:grid-cols-2">
      <textarea class="border rounded resize-none font-mono" wrap="off" ref="textarea" v-model="lyrics" />
      <p class="whitespace-pre">{{ changedLyrics }}</p>
      <dev-only>
        {{ scale }}
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

  &.active {
    @apply bg-gray-200;
  }
}
</style>
