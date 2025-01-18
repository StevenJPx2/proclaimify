<script lang="ts" setup>
const { encodedLyrics, scale } = defineProps<{
  encodedLyrics: EncodedLyrics | undefined;
  scale: string | undefined;
}>();

const toChordFormat = ref<ChordLyricFormat>(chordTypesTuple[1].format);
const count = ref(0);

const changedLyrics = computed(() => {
  if (!encodedLyrics) return "";

  return toChordFormat.value.decodeLyrics(
    encodedLyrics.map((line) =>
      line.map((val) => ({
        ...val,
        chord: !val.chord ? undefined : transposeChord(val.chord, count.value),
      })),
    ),
  );
});

const getRelativeChordSpacing = (targetScale: string) => {
  if (!scale) return count.value;
  return findChordStepIndex(targetScale) - findChordStepIndex(scale);
};
</script>

<template>
  <copy-text-area :text="changedLyrics">
    <template #toolbar>
      <u-form-field label="to chord format">
        <u-select
          v-model="toChordFormat"
          :items="
            chordTypesTuple.map(({ name, format }) => ({
              label: name,
              value: format,
            }))
          "
        />
      </u-form-field>

      <u-form-field label="transpose">
        <div class="flex gap-2 items-center">
          <u-button
            :variant="count === 0 ? 'soft' : 'solid'"
            :disabled="count === 0"
            @click="count = 0"
          >
            0
          </u-button>
          <u-input-number class="max-w-24" v-model="count" />
          <u-input
            v-if="!!scale"
            class="w-9"
            :value="transposeChord(scale, count)"
            @update:model-value="
              (e) =>
                (count = getRelativeChordSpacing(e.toString().toUpperCase()))
            "
          />
        </div>
      </u-form-field>
    </template>
  </copy-text-area>
</template>
