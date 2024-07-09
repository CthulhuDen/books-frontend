import { ref } from 'vue'
import { defineStore } from 'pinia'

type Toast = {
  type: 'error'
  message: string
}

export const useToastsStore = defineStore('toasts', () => {
  const toasts = ref<Toast[]>([])

  const add = (msg: Toast) => {
    toasts.value.push(msg)
  }

  const remove = (ix: number) => {
    toasts.value.splice(ix, 1)
  }

  return { toasts, add, remove }
})
