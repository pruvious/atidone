<template>
  <NuxtLayout>
    <div class="flex flex-col gap-4">
      <p class="font-medium">{{ _('Welcome to Atidone + Pruvious v4.') }}</p>
      <p>
        A
        <a
          href="https://nuxt.com"
          target="_blank"
          class="text-primary-500"
          rel="noopener"
          >Nuxt</a
        >
        +
        <a
          href="https://pruvious.com"
          target="_blank"
          class="text-primary-500"
          rel="noopener"
          >Pruvious</a
        >
        demo hosted on
        <a
          href="https://workers.cloudflare.com"
          target="_blank"
          rel="noopener"
          class="text-primary-500"
          >Cloudflare Workers</a
        >
        with
        <NuxtLink
          href="https://developers.cloudflare.com/d1/"
          target="_blank"
          rel="noopener"
          class="text-primary-500"
          >Cloudflare D1 database</NuxtLink
        >.
      </p>
      <p>
        {{ _('Based on') }}:
        <a
          href="https://github.com/atinux/atidone"
          target="_blank"
          rel="noopener"
          class="text-primary-500"
          >github.com/atinux/atidone</a
        >
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { _, isLoggedIn } from '#pruvious/client'

definePageMeta({
  middleware: [
    'pruvious-auth',
    'language',
    () => {
      if (isLoggedIn()) {
        return navigateTo('/todos')
      }
    },
  ],
})
</script>
