<script setup lang="ts">
import type { Author, Series } from '@/api/client'
import type { BooksGroup } from '@/utils/types'
import BooksGroupItem from '@/components/books/BooksGroupItem.vue'

defineProps<{
  groups: BooksGroup[]
  authors: Record<string, Author>
  series: Record<string, Series>
  offsetTop: number
  nestLevel: number
}>()
</script>

<template>
  <BooksGroupItem
    v-for="(group, ix) in groups"
    :key="ix"
    :group="group"
    :authors="authors"
    :series="series"
    :offset-top="offsetTop"
    :nest-level="nestLevel"
  />
</template>
