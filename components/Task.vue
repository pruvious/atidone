<template>
  <div class="flex gap-2 items-start">
    <UTextarea
      :rows="1"
      autoresize
      :modelValue="value"
      @update:modelValue="$emit('update:value', $event)"
      class="flex-1"
    />
    <UButton @click="" icon="i-heroicons-arrow-uturn-left" square v-if="done" />
    <UButton @click="" icon="i-heroicons-check" square v-else />
    <UButton @click="" icon="i-heroicons-trash" color="red" square />
  </div>
</template>

<script setup lang="ts">
defineProps({
  value: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    required: true,
  },
})

defineEmits<{
  'update:value': [value: string]
}>()
</script>
