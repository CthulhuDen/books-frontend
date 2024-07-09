<script setup lang="ts">
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/vue'
import { computed, ref, watchEffect } from 'vue'

import { onlyLastResponse } from '@/utils/fetch'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  multiple: { type: Boolean, default: false },
  nullable: { type: Boolean, default: false },
  items: { type: [Array, Function], required: true },
  width: { type: String, default: 'w-64' },
  textValue: { type: Function },
  by: { type: [String, Function] }
})

const model = defineModel()

const search = ref('')

let itemsSearched: any
if (props.items instanceof Array) {
  itemsSearched = computed(() => {
    return search.value === ''
      ? props.items
      : (props.items as any[]).filter((item) =>
          item.toString().toLowerCase().includes(search.value.trim().toLowerCase())
        )
  })
} else {
  itemsSearched = ref([])

  const olr = onlyLastResponse()
  watchEffect(async () => {
    let items = await olr((props.items as (s: string) => Promise<any[]>)(search.value))
    if (items != null) {
      itemsSearched.value = items
    }
  })
}

const itemsFiltered =
  model.value instanceof Array
    ? computed(() =>
        itemsSearched.value.filter((item: any) => !(model.value as any[]).includes(item))
      )
    : itemsSearched

const focused = ref(false)

const selectAll = (opts: any[]) => {
  for (let item of opts) {
    ;(model.value as any[]).push(item)
  }
}

const { t } = useI18n()
</script>

<template>
  <Combobox
    v-slot="{ open }"
    v-model="model as any"
    :multiple="multiple"
    :nullable="nullable"
    :by="by"
  >
    <ComboboxInput
      class="input bg-base-200"
      :class="[width, { 'input-primary': multiple || !model, 'input-accent': !multiple && model }]"
      :display-value="textValue as any"
      @change="search = $event.target.value"
      @focus="search = $event.target.value"
      @focusin="focused = true"
      @focusout="focused = false"
    />
    <ComboboxOptions
      v-if="open || focused"
      static
      as="ul"
      class="menu bg-base-300 rounded-box p-2 shadow absolute top-[100%] max-h-[calc(min(24rem,90dvh))] flex-nowrap overflow-x-auto z-[1]"
      :class="[width]"
    >
      <li v-if="multiple && search && itemsFiltered.length > 1">
        <a @click="selectAll(itemsFiltered)">{{ t('component.select.label_all') }}</a>
      </li>
      <li v-if="multiple && search && itemsFiltered.length > 1" class="menu-title">
        <a>{{ t('component.select.label_found') }}</a>
      </li>
      <li v-if="itemsFiltered.length === 0" class="disabled">
        <a>{{ t('component.select.label_not_found') }}</a>
      </li>
      <ComboboxOption
        v-else
        v-for="item in itemsFiltered"
        :key="item as any"
        :value="item as any"
        as="li"
      >
        <slot name="item" :item="item">
          <a>{{ item }}</a>
        </slot>
      </ComboboxOption>
    </ComboboxOptions>
  </Combobox>
</template>
