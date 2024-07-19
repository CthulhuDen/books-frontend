<script setup lang="ts">
import type { Author, BookGrouping, Series } from '@/api/client'
import type { BooksGroup } from '@/utils/types'
import BooksGroups from '@/components/books/BooksGroups.vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BookCard from '@/components/books/BookCard.vue'
import { tl } from '@/utils/i18n'

const props = defineProps<{
  group: BooksGroup
  authors: Record<string, Author>
  series: Record<string, Series>
  offsetTop: number
  nestLevel: number
}>()

const { t } = useI18n()

const stringifyGroup = (group: BookGrouping) => {
  switch (group.type) {
    case 'genres':
      return tl(group.value)
    case 'author':
      return t('books.group.label_author', { name: props.authors[group.value].name })
    case 'series':
      return props.series[group.value].title
  }
}

const header = ref()
const headerHeight = ref(55)

let checkSize = new ResizeObserver((entries) => {
  for (let entry of entries) {
    headerHeight.value = entry.borderBoxSize[0].blockSize
  }
})

onMounted(() => {
  checkSize.observe(header.value as Element)
})

onBeforeUnmount(() => {
  checkSize.unobserve(header.value as Element)
})
</script>

<template>
  <div class="[&:first-child>h2]:mt-0">
    <h2
      class="leading-[1.3333] text-2xl font-bold bg-base-100 p-3 sticky text-accent"
      ref="header"
      :class="{
        'pt-0': nestLevel > 0,
        'first:mt-3': nestLevel > 0
      }"
      :style="{ top: offsetTop + 'px', 'z-index': 3 - nestLevel }"
    >
      {{ stringifyGroup(group.group) }}
    </h2>
    <div class="z-0">
      <template v-if="group.books.type === 'plain'">
        <BookCard
          v-for="book in group.books.books"
          :key="book.id"
          :book="book"
          :series="series"
          :authors="authors"
        />
      </template>
      <BooksGroups
        v-else
        :groups="group.books.groups"
        :series="series"
        :authors="authors"
        :offset-top="offsetTop + headerHeight - 1"
        :nest-level="nestLevel + 1"
      />
    </div>
  </div>
</template>
