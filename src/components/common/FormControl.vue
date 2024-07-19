<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['clear'])

withDefaults(
  defineProps<{
    label: string
    canClear: boolean
  }>(),
  {
    canClear: () => false
  }
)

const { t } = useI18n()
</script>

<template>
  <div class="form-control relative">
    <label>
      <span class="label">
        <span class="label-text">{{ label }}</span>
      </span>
      <span class="flex">
        <slot name="default" />
      </span>
    </label>
    <button
      v-if="canClear"
      class="absolute right-0 top-1.5 btn btn-xs btn-ghost text-red-600"
      @click="emit('clear')"
    >
      {{ t('component.form.clear') }}
    </button>
  </div>
</template>
