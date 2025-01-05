<script lang="ts" setup>
defineProps({ desc: { type: String }, text: { type: String, required: true } });
const { copy, copied } = useClipboard();
const toast = useToast();

watch(copied, () => {
  if (copied.value) toast.add({ color: "success", title: "Copied to clipboard!" });
});
</script>

<template>
  <div>
    <div class="flex justify-between mb-2 text-primary">
      <h3 class="font-inter">{{ desc }}</h3>
      <button
        @click="copy(text)"
        :name="desc?.toLowerCase().split(' ').join('-')"
      >
        <icon
          :name="
            copied
              ? 'heroicons:clipboard-document-check-20-solid'
              : 'heroicons:clipboard-document-20-solid'
          "
          size="25"
        />
      </button>
    </div>
    <p
      class="whitespace-pre overflow-scroll h-96 border-4 border-primary rounded-lg p-2"
    >
      {{ text }}
    </p>
  </div>
</template>
