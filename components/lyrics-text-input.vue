<script lang="ts" setup>
const scale = defineModel<string>("scale", {
  required: true,
});
const encodedLyrics = defineModel<EncodedLyrics>({
  required: true,
});

const lyrics = ref("");
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
        chords:
          encodedLyrics.value
            ?.flat()
            .flatMap((lyric) => (lyric.chord ? [lyric.chord.trim()] : []))
            .join(" ") ?? "",
      },
    });
  },

  1000,
);

watchDebounced(
  lyrics,
  (val, oldVal) => {
    encodedLyrics.value = fromChordFormat.value.encodeLyrics(val.split("\n"));

    if (hasManuallyChangedChordFormat.value) return;
    fromChordFormat.value = chordTypesObj[detectChordFormat(val)];

    if (oldVal?.trim() === "" && val.trim() !== "") guessScale();
  },
  { debounce: 50, immediate: true },
);

const hasManuallyChangedChordFormat = ref(false);
const fromChordFormat = ref<ChordLyricFormat>(chordTypesTuple[0].format);
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex gap-5 mb-4">
      <u-form-field
        :ui="{ container: 'flex items-center' }"
        label="original scale"
      >
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

      <u-form-field label="from format">
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
      class="resize-none w-full h-full"
      :ui="{ base: ['h-full min-h-80'] }"
      placeholder="Enter lyrics here..."
      :rows="0"
      v-model="lyrics"
      wrap="off"
    />
  </div>
</template>
