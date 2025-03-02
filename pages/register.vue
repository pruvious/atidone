<template>
  <NuxtLayout>
    <UForm ref="form" :state="state" @submit="onSubmit" class="space-y-4">
      <UFormGroup :label="_('First name')" name="firstName">
        <UInput v-model="state.firstName" />
      </UFormGroup>

      <UFormGroup :label="_('Last name')" name="lastName">
        <UInput v-model="state.lastName" />
      </UFormGroup>

      <UFormGroup :label="_('Email')" name="email">
        <UInput v-model="state.email" autocomplete="email" />
      </UFormGroup>

      <UFormGroup :label="_('Password')" name="password">
        <UInput
          v-model="state.password"
          type="password"
          autocomplete="new-password"
        />
      </UFormGroup>

      <UButton type="submit"> {{ _('Register') }} </UButton>
    </UForm>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { _, isLoggedIn, pruviousPost, storeAuthToken } from '#pruvious/client'
import type { Collections } from '#pruvious/server'
import type { Form, FormSubmitEvent } from '#ui/types'
import { isArray } from '@pruvious/utils'

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

type Schema = Pick<
  Collections['Users']['TInputTypes'],
  'firstName' | 'lastName' | 'email' | 'password'
>

const state = reactive<Schema>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
})

const form = ref<Form<Schema>>()
const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  form.value!.clear()

  // Types for custom routes are a work in progress
  const response = await pruviousPost('register' as any, {
    body: event.data,
  })

  if (response.success) {
    storeAuthToken(response.data.token)
    await navigateTo('/')
  } else if (
    response.error.statusCode === 422 &&
    isArray(response.error.data)
  ) {
    form.value!.setErrors(
      Object.entries(response.error.data[0]!).map(([path, message]) => ({
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
