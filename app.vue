<script lang="ts" setup>
import { type EncodedLyrics, type ChordLyricFormat } from "./utils";

const scale = ref<string>();
const lyrics = ref("");
const { count, inc, dec, set, reset } = useCounter();
const hasManuallyChangedChordFormat = ref(false);
const fromChordFormat = ref<ChordLyricFormat>(chordTypesTuple[0].format);
const toChordFormat = ref<ChordLyricFormat>(chordTypesTuple[1].format);

const encodedLyrics = computed<EncodedLyrics>(() =>
  fromChordFormat.value.encodeLyrics(lyrics.value.split("\n")).map((line) =>
    line.map((val) => ({
      ...val,
      chord: !val.chord ? undefined : transposeChord(val.chord, count.value),
    })),
  ),
);

const changedLyrics = computed(() =>
  toChordFormat.value.decodeLyrics(encodedLyrics.value),
);

const lowerThirdLyrics = computed(() => makeLowerThirds(encodedLyrics.value));

const getRelativeChordSpacing = (targetScale: string) => {
  if (!scale.value) return count.value;
  return findChordStepIndex(targetScale) - findChordStepIndex(scale.value);
};

const copied = ref(false);
const bus = useEventBus<boolean>("copied");
bus.on((val) => (copied.value = val));

watch(lyrics, (val) => {
  if (hasManuallyChangedChordFormat.value) return;
  fromChordFormat.value = chordTypesObj[detectChordFormat(val)];
  set(0);
});
</script>

<template>
  <notification :appear="copied" text="Copied!" type="success" />
  <main class="max-w-screen-lg w-full mx-auto px-3 py-8">
    <section class="flex flex-col lg:flex-row gap-5 items-center mb-6">
      <div
        class="rounded-lg border-4 border-primary py-4 w-full max-w-sm grid place-items-center"
      >
        <svgo-pcfy-logo
          class="min-h-[100px] min-w-[100px] text-primary aspect-square"
        />
      </div>
      <div class="grid gap-3">
        <label for="scale" class="block">
          original scale
          <input class="w-20" type="text" id="scale" v-model="scale" />
        </label>
        <label for="from-chord-format" class="block">
          from chord format
          <select
            v-model="fromChordFormat"
            @blur="hasManuallyChangedChordFormat = true"
          >
            <option
              v-for="chordType in chordTypesTuple"
              :key="chordType.name"
              :value="chordType.format"
            >
              {{ chordType.name }}
            </option>
          </select>
        </label>
        <label for="to-chord-format" class="block">
          to chord format
          <select v-model="toChordFormat">
            <option
              v-for="chordType in chordTypesTuple"
              :key="chordType.name"
              :value="chordType.format"
            >
              {{ chordType.name }}
            </option>
          </select>
        </label>
      </div>
    </section>

    <section class="flex items-center mb-4">
      <button class="btn !rounded-r-none !border-r-0" @click="dec()">-</button>
      <div class="flex">
        <input
          class="!border-y-none !rounded-none !p-0 !pl-1 w-10"
          type="number"
          :value="count"
          @change="
            (e) => set((e.currentTarget as HTMLInputElement).valueAsNumber)
          "
        />
        <input
          v-if="!!scale"
          class="!border-l-0 !rounded-none !p-0 !pl-1 w-10"
          type="type"
          :value="transposeChord(scale, count)"
          @input="
            (e) =>
              set(
                getRelativeChordSpacing(
                  (e.currentTarget as HTMLInputElement).value,
                ),
              )
          "
        />
      </div>
      <button class="btn !rounded-l-none !border-l-0" @click="inc()">+</button>
      <button class="btn ml-3" @click="reset()">0</button>
    </section>

    <section
      class="flex flex-col lg:grid gap-4 lg:grid-rows-2 lg:grid-cols-2 font-normal font-mono"
    >
      <textarea
        class="resize-none lg:row-span-full min-h-[24rem] bg-background border-4 border-primary rounded-lg p-2 placeholder:text-normal placeholder:opacity-50"
        placeholder="Enter lyrics here..."
        v-model="lyrics"
        wrap="off"
      />
      <copy-text-area
        v-for="(generatedLyrics, index) in [
          { desc: 'Converted Lyrics', text: changedLyrics },
          { desc: 'Lower Thirds', text: lowerThirdLyrics },
        ]"
        :key="index"
        :desc="generatedLyrics.desc"
        :text="generatedLyrics.text"
      />
    </section>

    <dev-only>
      {{ scale }}
      <pre>{{ JSON.stringify(encodedLyrics, null, 2) }}</pre>
    </dev-only>
  </main>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");

:root {
  --color-primary: #fb8661;
  --color-background: #fff;
  --color-normal: #000;

  @media (prefers-color-scheme: dark) {
    --color-primary: #fff;
    --color-background: #fb8661;
    --color-normal: #fff;
  }
}

body {
  font-family: "Inter", sans-serif;
  @apply text-lg;
  @apply text-normal;
  @apply font-semibold;
  @apply bg-background;
}

label,
input,
select {
  @apply text-primary;
  @apply bg-background;
}

input:not([type="submit"]),
select {
  @apply rounded-lg;
  @apply border-4;
  @apply border-primary;
  @apply px-3;
  @apply py-1;
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
