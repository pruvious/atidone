<template>
  <NuxtLayout>
    <form class="flex flex-col gap-4" @submit.prevent="addTodo(newTodo)">
      <div class="flex items-center gap-2">
        <UInput
          ref="new-todo"
          v-model="newTodo"
          name="todo"
          :disabled="loading"
          class="flex-1"
          :placeholder="_('Enter task description')"
          autocomplete="off"
          autofocus
          :ui="{ wrapper: 'flex-1' }"
        />

        <UButton
          type="submit"
          icon="i-heroicons-plus-20-solid"
          :loading="loading"
          :disabled="newTodo.trim().length === 0"
        />
      </div>

      <ul class="divide-y divide-gray-200 dark:divide-gray-800">
        <li
          v-for="todo of todos"
          :key="todo.id"
          class="flex items-center gap-4 py-2"
        >
          <span
            class="flex-1 font-medium"
            :class="[todo.completed ? 'line-through text-gray-500' : '']"
            >{{ todo.title }}</span
          >

          <UToggle
            :model-value="todo.completed"
            @update:model-value="toggleTodo(todo)"
          />

          <UButton
            color="red"
            variant="soft"
            size="2xs"
            icon="i-heroicons-x-mark-20-solid"
            @click="deleteTodo(todo)"
          />
        </li>
      </ul>
    </form>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {
  _,
  deleteFrom,
  getUser,
  insertInto,
  isLoggedIn,
  selectFrom,
  update,
} from '#pruvious/client'
import type { Collections } from '#pruvious/server'
import { lockAndLoad, type NonEmptyArray } from '@pruvious/utils'

definePageMeta({
  middleware: [
    'pruvious-auth',
    'language',
    () => {
      if (!isLoggedIn()) {
        return navigateTo('/')
      }
    },
  ],
})

type Todo = Pick<
  Collections['Todos']['TCastedTypes'],
  'title' | 'completed' | 'createdAt'
> & { id: number }

const selectFields: NonEmptyArray<keyof Todo> = [
  'id',
  'title',
  'completed',
  'createdAt',
]
const newTodo = ref('')
const newTodoInput = useTemplateRef('new-todo')
const todos = ref<Todo[]>([])
const toast = useToast()
const loading = ref(false)

const todosQuery = await selectFrom('Todos')
  .select(selectFields)
  .where('author', '=', getUser()!.id)
  .orderBy('createdAt', 'desc')
  .all()

if (todosQuery.success) {
  todos.value = todosQuery.data
} else {
  toast.add({ title: todosQuery.runtimeError, color: 'red' })
}

const addTodo = lockAndLoad(loading, async (title: string) => {
  const createTodoQuery = await insertInto('Todos')
    .values({ title })
    .returning(selectFields)
    .run()

  if (createTodoQuery.success) {
    todos.value.unshift(createTodoQuery.data[0]!)
    newTodo.value = ''
    setTimeout(() => newTodoInput.value?.input.focus())
  } else {
    toast.add({
      title:
        createTodoQuery.runtimeError ??
        JSON.stringify(createTodoQuery.inputErrors),
      color: 'red',
    })
  }
})

async function toggleTodo(todo: Todo) {
  const updateTodoQuery = await update('Todos')
    .set({ completed: !todo.completed })
    .where('id', '=', todo.id)
    .returning(selectFields)
    .run()

  if (updateTodoQuery.success) {
    const index = todos.value.findIndex((t) => t.id === todo.id)
    todos.value[index] = updateTodoQuery.data[0]!
  } else {
    toast.add({
      title:
        updateTodoQuery.runtimeError ??
        JSON.stringify(updateTodoQuery.inputErrors),
      color: 'red',
    })
  }
}

async function deleteTodo(todo: Todo) {
  const deleteTodoQuery = await deleteFrom('Todos')
    .where('id', '=', todo.id)
    .run()

  if (deleteTodoQuery.success) {
    todos.value = todos.value.filter((t) => t.id !== todo.id)
  } else {
    toast.add({ title: deleteTodoQuery.runtimeError, color: 'red' })
  }
}
</script>
