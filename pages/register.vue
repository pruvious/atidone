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
import { _, isLoggedIn, pfetch, storeAuthToken } from '#pruvious/client'
import type { Collections } from '#pruvious/server'
import type { Form, FormSubmitEvent } from '#ui/types'
import { isArray, isString } from '@pruvious/utils'
import { FetchError } from 'ofetch'

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

  await pfetch('/api/register', {
    method: 'post',
    body: event.data,
  })
    .then(async ({ token }) => {
      storeAuthToken(token)
      await navigateTo('/')
    })
    .catch(
      ({
        statusCode,
        statusMessage,
        data,
      }: FetchError<Record<string, string>>) => {
        if (statusCode === 422 && isArray(data?.data)) {
          form.value!.setErrors(
            Object.entries(data.data[0]!).map(([path, message]) => ({
              path,
              message,
            }))
          )
        } else {
          toast.add({
            title: isString(data?.message)
              ? data.message
              : statusMessage ?? _('Something went wrong'),
            color: 'red',
          })
        }
      }
    )
}
</script>
