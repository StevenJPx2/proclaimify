<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    appear: boolean;
    text: string;
    icon?: string;
    type: "none" | "info" | "success" | "error";
  }>(),
  { type: "none" },
);

const icons: { [I in (typeof props)["type"]]: string } = {
  none: "",
  success: "heroicons:check-badge-20-solid",
  info: "heroicons:information-circle-20-solid",
  error: "heroicons:x-circle-20-solid",
};
</script>
<template>
  <div class="pointer-events-none w-full fixed mt-5">
    <transition
      appear
      mode="in-out"
      enter-from-class="opacity-0 scale-[.4] -translate-y-6"
      enter-active-class="transition ease-out-expo duration-500"
      enter-to-class="opacity-1 scale-100 translate-y-0"
      leave-from-class="opacity-1 scale-100 translate-y-0"
      leave-active-class="transition ease-in-sine duration-200"
      leave-to-class="opacity-0 scale-[.4] -translate-y-8"
    >
      <div
        v-if="appear"
        class="flex items-center gap-2 rounded-lg shadow-black/20 shadow-lg z-[1000] px-5 py-3 mx-auto w-max bg-white"
        :class="{
          'text-green-700': type === 'success',
          'text-black': type === 'none',
          'text-sky-700': type === 'info',
          'text-red-700': type === 'error',
        }"
      >
        <icon :name="icon ?? icons[type]" />
        {{ text }}
      </div>
    </transition>
  </div>
</template>
