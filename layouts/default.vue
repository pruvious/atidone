<template>
  <UContainer class="min-h-screen flex flex-col py-4">
    <div class="mb-2 flex gap-2 items-center justify-end">
      <Language />
      <ColorMode />
    </div>

    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold leading-6">
          <NuxtLink to="/"> Atidone + Pruvious v4 </NuxtLink>
        </h3>
        <Auth />
      </template>
      <slot />
    </UCard>

    <footer class="text-center mt-2">
      <NuxtLink
        href="https://github.com/pruvious/atidone"
        target="_blank"
        class="text-sm text-gray-500 hover:text-gray-700"
      >
        GitHub
      </NuxtLink>
      ·
      <NuxtLink
        href="https://github.com/atinux/atidone"
        target="_blank"
        class="text-sm text-gray-500 hover:text-gray-700"
      >
        Atidone
      </NuxtLink>
    </footer>
  </UContainer>
  <UNotifications />
</template>

<style lang="postcss">
body {
  @apply font-sans text-gray-950 bg-gray-50 dark:bg-gray-950 dark:text-gray-50;
}
</style>
