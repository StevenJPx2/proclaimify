<script lang="ts" setup>
defineProps({ desc: { type: String }, text: { type: String, required: true } });
const { copy, copied } = useClipboard();
const toast = useToast();

watch(copied, (v) => {
  if (v) toast.add({ color: "success", title: "Copied to clipboard!" });
});
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between mb-4 text-primary">
      <div class="flex gap-5">
        <slot name="toolbar">
          <h3 class="font-inter">
            {{ desc }}
          </h3>
        </slot>
      </div>
      <button
        @click="copy(text)"
        :name="desc?.toLowerCase().split(' ').join('-')"
        class="self-end flex items-end cursor-pointer"
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
      class="whitespace-pre overflow-scroll h-full min-h-30 max-h-[60vh] border-1 border-primary rounded-lg py-1 px-2 after:text-sm after:opacity-30 empty:after:content-['No_text_to_display']"
    >
      {{ text }}
    </p>
  </div>
</template>
