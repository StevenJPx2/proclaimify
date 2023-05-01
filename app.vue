<script lang="ts" setup>
import { EncodedLyric } from "./utils";

const scale = ref<string>();
const lyrics = ref(sampleLyrics);
const { textarea } = useTextareaAutosize({ input: lyrics });
const { count, inc, dec, set, reset } = useCounter();

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
  insetChords.decodeLyrics(encodedLyrics.value)
);

const getRelativeChordSpacing = (targetScale: string) => {
  if (!scale.value) return count.value;
  return findChordStepIndex(targetScale) - findChordStepIndex(scale.value);
};
</script>

<template>
  <main class="max-w-screen-lg w-full mx-auto px-3">
    <label for="scale" class="mb-3 block">
      Scale:
      <input
        class="border px-4 py-2 rounded"
        type="text"
        id="scale"
        v-model="scale"
      />
    </label>
    <div class="flex items-center gap-2 mb-4">
      <button class="btn" @click="dec()">-1</button>
      <div class="flex">
        <input
          class="border rounded-l w-8"
          type="number"
          :value="count"
          @change="(e) => set((e.currentTarget as HTMLInputElement).valueAsNumber)"
        />
        <input
          v-if="!!scale"
          class="border border-l-0 rounded-r w-8"
          type="type"
          :value="transposeChord(scale, count)"
          @input="(e) => set(getRelativeChordSpacing((e.currentTarget as HTMLInputElement).value))"
        />
      </div>
      <button class="btn" @click="inc()">+1</button>
      <button class="btn ml-3" @click="reset()">0</button>
    </div>
    <div class="grid gap-4 lg:grid-cols-2">
      <textarea
        class="border rounded resize-none font-mono"
        wrap="off"
        ref="textarea"
        v-model="lyrics"
      />
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
}
</style>
