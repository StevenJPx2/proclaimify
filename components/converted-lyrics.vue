<script lang="ts" setup>
const { encodedLyrics, scale } = defineProps<{
  encodedLyrics: EncodedLyrics;
  scale: string;
}>();

const toChordFormat = ref<ChordLyricFormat>(chordTypesTuple[1].format);
const count = ref(0);
const isNumbers = ref(false);

const chordNumbering = computed(() => getChordNumbering(scale));

const changedLyrics = computed(() => {
  if (!encodedLyrics) return "";

  return toChordFormat.value.decodeLyrics(
    encodedLyrics.map((line) =>
      line.map((val) => {
        if (!val.chord) return val;

        let chord = val.chord;

        if (isNumbers.value) {
          chord = chord.replaceAll(
            new RegExp(notePattern, "g"),
            (note) =>
              chordNumbering.value[note]?.toString() ??
              transposeChord(note, count.value),
          );
        } else {
          chord = transposeChord(chord, count.value);
        }

        return {
          ...val,
          chord,
        };
      }),
    ),
  );
});

const transposedScale = computed({
  get: () => transposeChord(scale, count.value),
  set: (val) => {
    if (!scale) return;
    return (count.value = findChordStepIndex(val) - findChordStepIndex(scale));
  },
});
</script>

<template>
  <copy-text-area :text="changedLyrics">
    <template #toolbar>
      <u-form-field label="to format">
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
          <u-input v-if="!!scale" class="w-9" v-model="transposedScale" />
        </div>
      </u-form-field>
      <u-form-field v-if="!!scale">
        <template #label>
          {{ isNumbers ? "numbers" : "chords" }}
          <u-badge variant="outline" size="sm"> beta </u-badge>
        </template>
        <u-button variant="subtle" @click="isNumbers = !isNumbers">
          {{ isNumbers ? "123" : "ABC" }}
        </u-button>
      </u-form-field>
    </template>
  </copy-text-area>
</template>
