<script setup lang="ts">
import type { Author, Series, Book } from '@/api/client'
import BookCard from '@/components/books/BookCard.vue'

defineProps<{
  books: Book[]
  authors: Record<string, Author>
  series: Record<string, Series>
}>()
</script>

<template>
  <BookCard v-for="book in books" :key="book.id" :book="book" :series="series" :authors="authors" />
</template>
