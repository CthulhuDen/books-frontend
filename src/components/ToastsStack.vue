<script setup lang="ts">
import { useToastsStore } from '@/stores/toasts'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const toastsStore = useToastsStore()
const { toasts } = storeToRefs(toastsStore)
const { remove } = toastsStore

const { t } = useI18n()
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
      <button
        class="btn btn-lg btn-ghost before:content-[attr(data-after)] before:text-2xl"
        :title="t('toasts.dismiss')"
        data-after="&times;"
        @click="remove(ix)"
      ></button>
    </div>
  </div>
</template>
