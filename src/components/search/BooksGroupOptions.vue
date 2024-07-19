<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { BookGroupingType } from '@/api/client'
import { navSet, useNavigateListener } from '@/utils/navigate'
import { arrayEquals } from '@/utils/helpers'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const options: Record<BookGroupingType, string> = {
  genres: t('term.genres'),
  author: t('term.authors'),
  series: t('term.sequences')
}

const chosen = ref<BookGroupingType[]>([])

useNavigateListener(
  'group',
  (g: string[]) => {
    if (!arrayEquals(g, chosen.value)) {
      chosen.value = g as BookGroupingType[]
    }
  },
  true
)

const getIx = (opt: BookGroupingType) => chosen.value.indexOf(opt)
const toggle = (opt: BookGroupingType) => {
  let cur_ix = getIx(opt)
  if (cur_ix === -1) {
    chosen.value.push(opt)
  } else {
    chosen.value.splice(cur_ix, 1)
  }
}

const emit = defineEmits(['input'])
watchEffect(() => {
  navSet('group', ...chosen.value)
  emit('input', chosen.value)
})
</script>

<template>
  <div class="form-control relative">
    <span class="label">
      <span class="label-text">{{ t('search.group.label') }}</span>
    </span>
    <div class="join flex">
      <button
        v-for="(lbl, opt) in options"
        :key="opt"
        @click="toggle(opt)"
        class="btn btn-sm btn-outline join-item grow basis-0 px-0"
        :class="{ 'btn-primary': getIx(opt) === -1, 'btn-accent': getIx(opt) !== -1 }"
      >
        <span class="text-base-content">{{ lbl }}</span>
        <span v-if="getIx(opt) !== -1" class="badge badge-sm badge-accent">{{
          getIx(opt) + 1
        }}</span>
      </button>
    </div>
    <button
      v-if="chosen.length > 0"
      class="absolute right-0 top-1.5 btn btn-xs btn-ghost text-red-600"
      @click="chosen = []"
    >
      {{ t('component.form.clear') }}
    </button>
  </div>
</template>
