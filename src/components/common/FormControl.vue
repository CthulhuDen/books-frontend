<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <label class="form-control">
    <span class="label">
      <span class="label-text">{{ label }}</span>
    </span>
    <span class="flex">
      <slot name="default" />
    </span>
  </label>
</template>
