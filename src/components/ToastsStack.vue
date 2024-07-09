<script setup lang="ts">
import { useToastsStore } from '@/stores/toasts'
import { storeToRefs } from 'pinia'

const toastsStore = useToastsStore()
const { toasts } = storeToRefs(toastsStore)
const { remove } = toastsStore
</script>

<template>
  <div class="toast">
    <div
      v-for="(toast, ix) in toasts"
      :key="ix"
      class="alert"
      :class="{ 'alert-error': toast.type === 'error' }"
    >
      <span>{{ toast.message }}</span>
      <button class="btn btn-lg btn-ghost" @click="remove(ix)">&times;</button>
    </div>
  </div>
</template>
