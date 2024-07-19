<script setup lang="ts">
import SearchForm from '@/components/SearchForm.vue'
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import ToastsStack from '@/components/ToastsStack.vue'
import type { Author, BookGrouping, BookInGroup, SearchBooksResponse, Series } from '@/api/client'
import { searchBooks, showError } from '@/api/client'
import { onlyLastResponse } from '@/utils/fetch'
import type { BooksCollection } from './utils/types'
import BooksGroups from '@/components/books/BooksGroups.vue'
import { arrayEquals } from '@/utils/helpers'
import { useI18n } from 'vue-i18n'
import BookCard from '@/components/books/BookCard.vue'

const query = ref()

const authors = ref<Record<string, Author>>({})
const series = ref<Record<string, Series>>({})
const collection = ref<BooksCollection>()

const isSameGroup = (g1: BookGrouping, g2: BookGrouping) => {
  if (g1.type !== g2.type) {
    return false
  }

  switch (g1.type) {
    case 'genres':
      return arrayEquals(g1.value, g2.value as string[])
    default:
      return g1.value === g2.value
  }
}

const addBookToCollection = (collection: BooksCollection, book: BookInGroup, groupIx = 0) => {
  if (collection.type == 'plain') {
    collection.books.push(book.book)
    return
  }

  if (
    collection.groups.length === 0 ||
    !isSameGroup(collection.groups[collection.groups.length - 1].group, book.groups[groupIx])
  ) {
    const subCollection: BooksCollection =
      book.groups.length > groupIx + 1
        ? { type: 'grouped', groups: [] }
        : { type: 'plain', books: [] }
    collection.groups.push({ group: book.groups[groupIx], books: subCollection })
  }

  addBookToCollection(collection.groups[collection.groups.length - 1].books, book, groupIx + 1)
}

const { t } = useI18n()

const olr = onlyLastResponse<SearchBooksResponse>()
let status: 'ready' | 'not_ready' | 'loading' | 'complete' = 'not_ready'
let currentQuery: {} | null = null
let offset = 0
watchEffect(async () => {
  const abort = new AbortController()
  status = 'not_ready'
  offset = 0
  const thisRequestQuery = (currentQuery = {})
  const ret = await showError(
    olr(searchBooks(query.value, abort), abort),
    t('message.error.search_books')
  )
  if (ret !== null) {
    if (thisRequestQuery === currentQuery) {
      status = 'ready'
    }

    let books: BookInGroup[]
    ;({ books, authors: authors.value, series: series.value } = ret)
    if (books.length === 0 || books[0].groups.length === 0) {
      collection.value = { type: 'plain', books: [] }
    } else {
      collection.value = { type: 'grouped', groups: [] }
    }

    for (const book of books) {
      addBookToCollection(collection.value, book)
    }

    offset = books.length
    if (books.length === 0) {
      status = 'complete'
    }

    setTimeout(checkLoadMore, 10)
  }
})

const endOfList = ref<HTMLElement>()
const checkLoadMore = async () => {
  const el = endOfList.value
  if (status !== 'ready' || !el) {
    return
  }

  if (el.getBoundingClientRect().top < Math.max(10 * window.innerHeight, 10000)) {
    status = 'loading'
    const thisRequestQuery = currentQuery
    const ret = await showError(
      searchBooks({ ...query.value, offset }),
      t('message.error.fetch_next_page_books')
    )
    if (currentQuery !== thisRequestQuery) {
      return
    }

    status = 'ready'

    let books: BookInGroup[]
    let moreAuthors: Record<string, Author>
    let moreSeries: Record<string, Series>
    ;({ books, authors: moreAuthors, series: moreSeries } = ret)

    Object.assign(authors.value, moreAuthors)
    Object.assign(series.value, moreSeries)

    for (const book of books) {
      addBookToCollection(collection.value as BooksCollection, book)
    }

    offset += books.length

    if (books.length === 0) {
      status = 'complete'
    }

    setTimeout(checkLoadMore, 10)
  }
}
onMounted(() => window.addEventListener('scroll', checkLoadMore))
onBeforeUnmount(() => window.removeEventListener('scroll', checkLoadMore))
</script>

<template>
  <div class="max-w-screen-xl mx-auto p-6">
    <h1 class="leading-[1.111111] text-4xl font-extrabold mb-4">{{ t('title') }}</h1>
    <SearchForm @input="(q) => (query = q)" />
    <div class="mx-[-1rem] md:mx-0 mt-0 md:mt-3">
      <template v-if="collection && collection.type === 'plain'">
        <BookCard
          v-for="book in collection.books"
          :key="book.id"
          :book="book"
          :series="series"
          :authors="authors"
        />
      </template>
      <BooksGroups
        v-else-if="collection"
        :groups="collection.groups"
        :series="series"
        :authors="authors"
        :offset-top="0"
        :nest-level="0"
      />
      <div ref="endOfList"></div>
    </div>
    <ToastsStack />
  </div>
</template>
