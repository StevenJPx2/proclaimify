<script lang="ts" setup>
import type { EncodedLyrics, ChordLyricFormat } from "./utils";

const scale = ref<string>();
const isGuessingScale = ref(false);

const guessScale = useDebounceFn(
  async () => {
    scale.value = await $fetch<string>("/api/guess-scale", {
      method: "post",
      onRequest() {
        isGuessingScale.value = true;
      },
      onResponse() {
        isGuessingScale.value = false;
      },
      body: {
        chords: encodedLyrics.value
          .flat()
          .flatMap((lyric) => (lyric.chord ? [lyric.chord.trim()] : []))
          .join(" "),
      },
    });
  },

  1000,
);

const lyrics = ref("");
const count = ref(0);

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

watchDebounced(
  lyrics,
  (val, oldVal) => {
    if (hasManuallyChangedChordFormat.value) return;
    fromChordFormat.value = chordTypesObj[detectChordFormat(val)];
    count.value = 0;

    if (oldVal.trim() === "" && val.trim() !== "") guessScale();
  },
  { debounce: 50 },
);
</script>

<template>
  <u-app>
    <main class="max-w-screen-lg w-full mx-auto px-3 py-8">
      <section class="flex flex-col lg:flex-row gap-5 items-center mb-6">
        <div
          class="rounded-lg border-4 border-primary py-4 w-full max-w-sm grid place-items-center"
        >
          <svgo-pcfy-logo
            class="min-h-[100px] min-w-[100px] text-primary aspect-square"
          />
        </div>
      </section>

      <section
        class="flex flex-col lg:grid gap-4 lg:grid-rows-2 lg:grid-cols-2 font-normal font-mono"
      >
        <div class="lg:row-span-full min-h-[24rem]">
          <div class="flex gap-5">
            <u-form-field label="original scale">
              <u-input class="w-20" type="text" id="scale" v-model="scale" />
              <u-button
                icon="heroicons:sparkles-solid"
                variant="ghost"
                @click="guessScale"
                class="ml-2"
                :class="{
                  'animate-pulse': isGuessingScale,
                }"
              />
            </u-form-field>

            <u-form-field label="from chord format">
              <u-select
                v-model="fromChordFormat"
                :items="
                  chordTypesTuple.map(({ name, format }) => ({
                    label: name,
                    value: format,
                  }))
                "
                @blur="hasManuallyChangedChordFormat = true"
              />
            </u-form-field>
          </div>
          <u-textarea
            class="resize-none"
            placeholder="Enter lyrics here..."
            :rows="24"
            v-model="lyrics"
            wrap="off"
          />
        </div>
        <u-tabs
          :items="[
            { label: 'Converted Lyrics', slot: 'converted' },
            { label: 'Lower Thirds', slot: 'lower' },
          ]"
        >
          <template #converted>
            <div>
              <div class="flex gap-2">
                <u-form-field label="to chord format">
                  <u-select
                    v-model="fromChordFormat"
                    :items="
                      chordTypesTuple.map(({ name, format }) => ({
                        label: name,
                        value: format,
                      }))
                    "
                  />
                </u-form-field>

                <section class="flex items-center mb-4">
                  <u-input-number v-model="count" />
                  <u-button @click="count = 0">0</u-button>
                </section>
              </div>
              <copy-text-area desc="Converted Lyrics" :text="changedLyrics" />
            </div>
          </template>
          <template #lower>
            <copy-text-area desc="Lower Thirds" :text="lowerThirdLyrics" />
          </template>
        </u-tabs>
      </section>

      <dev-only>
        {{ scale }}
        <pre>{{ JSON.stringify(encodedLyrics, null, 2) }}</pre>
      </dev-only>
    </main>
  </u-app>
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
