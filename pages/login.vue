<template>
  <NuxtLayout>
    <UForm ref="form" :state="state" @submit="onSubmit" class="space-y-4">
      <UFormGroup :label="_('Email')" name="email">
        <UInput v-model="state.email" autocomplete="email" />
      </UFormGroup>

      <UFormGroup :label="_('Password')" name="password">
        <UInput
          v-model="state.password"
          type="password"
          autocomplete="current-password"
        />
      </UFormGroup>

      <UButton type="submit"> {{ _('Sign in') }} </UButton>
    </UForm>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { _, isLoggedIn, pruviousPost, storeAuthToken } from '#pruvious/client'
import type { Collections } from '#pruvious/server'
import type { Form, FormSubmitEvent } from '#ui/types'
import { isObject } from '@pruvious/utils'

definePageMeta({
  middleware: [
    'pruvious-auth',
    'language',
    () => {
      if (isLoggedIn()) {
        return navigateTo('/')
      }
    },
  ],
})

type Schema = Pick<Collections['Users']['TInputTypes'], 'email' | 'password'>

const state = reactive<Schema>({
  email: '',
  password: '',
})

const form = ref<Form<Schema>>()
const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  form.value!.clear()

  const response = await pruviousPost('auth/login', {
    body: event.data as any,
  })

  if (response.success) {
    storeAuthToken(response.data.token)
    await navigateTo('/')
  } else if (
    response.error.statusCode === 422 &&
    isObject(response.error.data)
  ) {
    form.value!.setErrors(
      Object.entries(response.error.data).map(([path, message]) => ({
        path,
        message,
      }))
    )
  } else {
    toast.add({
      title: response.error.message ?? _('Something went wrong'),
      color: 'red',
    })
  }
}
</script>
