<script lang="ts" setup>
const { encodedLyrics } = defineProps<{
  encodedLyrics: EncodedLyrics | undefined;
}>();

const lowerThirdLyrics = computed(() => {
  if (!encodedLyrics) return "";

  return makeLowerThirds(encodedLyrics);
});
</script>

<template>
  <copy-text-area :text="lowerThirdLyrics" />
</template>
