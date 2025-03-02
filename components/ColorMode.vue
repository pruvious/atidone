<template>
  <UButton
    v-if="_colorMode === 'light'"
    square
    variant="ghost"
    color="black"
    icon="i-heroicons-sun"
    :class="{ invisible: !_colorMode }"
    @click="changeColorMode('dark')"
  />
  <UButton
    v-else
    square
    variant="ghost"
    color="black"
    icon="i-heroicons-moon"
    :class="{ invisible: !_colorMode }"
    @click="changeColorMode('light')"
  />
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const _colorMode = ref<'system' | 'light' | 'dark'>()

let prefersColorScheme: MediaQueryList | undefined

onMounted(() => {
  prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)')
  prefersColorScheme.addEventListener('change', updateColorMode)
  watch(() => colorMode.preference, updateColorMode, { immediate: true })
})

onUnmounted(() => {
  prefersColorScheme?.removeEventListener('change', updateColorMode)
})

function updateColorMode() {
  let newValue = colorMode.preference as 'system' | 'light' | 'dark'

  if (colorMode.preference === 'system') {
    newValue = window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  if (newValue === 'light') {
    document.documentElement.classList.remove('dark')
  }

  _colorMode.value = newValue
}

function changeColorMode(mode: 'system' | 'light' | 'dark') {
  colorMode.preference = mode
}
</script>
