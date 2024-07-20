<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import type { BookGroupingType } from '@/api/client'
import { navSet, useNavigateListener } from '@/utils/navigate'
import { arrayEquals } from '@/utils/helpers'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const options: Record<BookGroupingType, string> = reactive({
  genres: t('term.genres'),
  author: t('term.authors'),
  series: t('term.sequences')
})

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

  const el = document.activeElement
  if (el instanceof HTMLElement) {
    el.blur()
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
    <div class="flex items-center">
      <template v-for="(item, ix) in chosen" :key="ix">
        <button
          @click="toggle(item)"
          class="badge badge-accent badge-outline bg-base-200 flex-none group whitespace-nowrap overflow-hidden max-w-[99%] justify-start"
          :title="t('search.group.button_remove', { label: options[item] })"
        >
          <span class="text-base-content">{{ options[item] }}</span>
          <span class="px-1 ml-[-0.3rem] mr-[-0.6rem] text-base-200 group-hover:text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="size-4"
            >
              <path
                d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"
              />
            </svg>
          </span>
        </button>

        <svg
          v-if="ix < Object.keys(options).length - 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="size-4"
        >
          <path
            fill-rule="evenodd"
            d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      </template>
      <div
        v-show="chosen.length < Object.keys(options).length"
        class="dropdown flex-none block justify-start"
      >
        <div
          tabindex="0"
          role="button"
          class="flex badge badge-primary badge-outline bg-base-200 p-0 aspect-square"
          :title="t('search.group.button_show_add')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="size-4"
          >
            <path
              d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z"
            />
          </svg>
        </div>
        <ul
          tabindex="0"
          class="dropdown-content menu bg-base-300 rounded-box p-2 shadow z-[4] w-auto"
        >
          <li v-for="(lbl, opt) in options" :key="opt" v-show="getIx(opt) === -1">
            <button @click="toggle(opt)" :title="t('search.group.button_add', { label: lbl })">
              {{ lbl }} <span class="hidden">{{ getIx(opt) }}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
