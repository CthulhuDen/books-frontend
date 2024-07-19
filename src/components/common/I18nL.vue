<script setup lang="ts">
import { type Component, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  nested: {
    type: Boolean,
    default: false
  }
})

const slots = defineSlots<{ default(): any }>()

const items = ref([])

watchEffect(() => {
  items.value = slots.default()[0].children
})

useI18n()
</script>

<template>
  <slot name="default" v-if="items.length === 1" />
  <template v-else-if="items.length > 1">
    <i18n-t :keypath="props.nested ? 'list.append' : 'list.append_last'" scope="global">
      <template v-slot:items>
        <i18n-l nested>
          <component v-for="(item, ix) of items.slice(0, -1)" :key="ix" :is="item as Component" />
        </i18n-l>
      </template>
      <template v-slot:item>
        <component :is="items[items.length - 1] as Component" />
      </template>
    </i18n-t>
  </template>
</template>
