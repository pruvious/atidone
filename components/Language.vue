<template>
  <UDropdown :items="items">
    <UButton
      color="gray"
      variant="ghost"
      trailing-icon="i-heroicons-chevron-down-20-solid"
    >
      {{ label }}
    </UButton>
  </UDropdown>
</template>

<script setup lang="ts">
import {
  languages,
  preloadTranslatableStrings,
  pruviousPatch,
  useLanguage,
} from '#pruvious/client'
import type { DropdownItem } from '#ui/types'

const language = useLanguage()
const label = computed(
  () => languages.find(({ code }) => code === language.value)?.name
)
const items = [
  languages.map(({ code, name }) => ({
    label: name,
    click: async () => {
      await preloadTranslatableStrings('default', code)
      language.value = code
      localStorage.setItem('language', code)
      await pruviousPatch('me', { body: { contentLanguage: code } })
    },
  })),
] satisfies DropdownItem[][]
</script>
