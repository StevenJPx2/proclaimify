<script lang="ts" setup>
import type { EncodedLyrics } from "./utils";
const scale = ref<string>("");
const encodedLyrics = ref<EncodedLyrics>([]);
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
        class="min-h-96 flex flex-col lg:grid lg:grid-cols-2 gap-4 font-normal font-mono"
      >
        <lyrics-text-input
          class="lg:row-span-full"
          v-model="encodedLyrics"
          v-model:scale="scale"
        />
        <u-tabs
          class="h-full"
          :items="[
            { label: 'Converted Lyrics', slot: 'converted' },
            { label: 'Lower Thirds', slot: 'lower' },
          ]"
        >
          <template #converted>
            <converted-lyrics :encoded-lyrics="encodedLyrics" :scale="scale" />
          </template>
          <template #lower>
            <lower-thirds :encoded-lyrics="encodedLyrics" :scale="scale" />
          </template>
        </u-tabs>
      </section>

      <dev-only>
        <div>
          {{ scale }}
          <pre>{{ JSON.stringify(encodedLyrics, null, 2) }}</pre>
        </div>
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
  --ui-primary: #fb8661;

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
