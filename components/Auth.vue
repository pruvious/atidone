<template>
  <div class="flex gap-3">
    <template v-if="!auth.isLoggedIn">
      <UButton to="/login" :label="_('Sign in')" color="black" size="xs" />
      <UButton to="/register" :label="_('Register')" color="black" size="xs" />
    </template>
    <UDropdown v-else :items="items">
      <UButton
        color="gray"
        variant="ghost"
        trailing-icon="i-heroicons-chevron-down-20-solid"
      >
        {{ auth.user.firstName }} {{ auth.user.lastName }}
      </UButton>
    </UDropdown>
  </div>
</template>

<script setup lang="ts">
import { _, pruviousPost, removeAuthToken, useAuth } from '#pruvious/client'
import type { DropdownItem } from '#ui/types'

const auth = useAuth()

const items = [
  [
    {
      label: _('Sign out'),
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: logout,
    },
  ],
] satisfies DropdownItem[][]

async function logout() {
  await pruviousPost('auth/logout', {})
  removeAuthToken()
  await navigateTo('/')
}
</script>
