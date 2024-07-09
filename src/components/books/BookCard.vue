<script setup lang="ts">
import type { Author, Book, Series } from '@/api/client'
import ShowMore from '@/components/common/ShowMore.vue'
import { computed } from 'vue'
import { sanitize } from '@/utils/html'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  book: Book
  authors: Record<string, Author>
  series: Record<string, Series>
}>()

const about = computed(() => (props.book.about ? sanitize(props.book.about) : ''))

const { t } = useI18n()
</script>

<template>
  <div class="card bg-base-200 p-4 md:p-5 mt-3 md:mt-6 first:mt-0">
    <h2 class="leading-[1.3333] text-2xl font-bold mb-3">{{ book.title }}</h2>
    <div>
      <img
        v-if="book.cover_url"
        :src="book.cover_url as string"
        class="max-w-[50%] md:max-w-[25%] xl:max-w-[20%] float-right"
      />
      <div v-if="book.author_ids.length > 0" class="mb-2">
        <h4 class="inline-block leading-[1.5] font-semibold">
          {{ book.author_ids.length === 1 ? t('term.author') : t('term.authors') }}:
        </h4>
        {{}}
        <span v-for="(author_id, ix) in book.author_ids" :key="author_id">
          <template v-if="ix != 0">, </template>
          <template v-if="authors[author_id].avatar_url"
            ><img
              v-if="authors[author_id].avatar_url"
              :src="authors[author_id].avatar_url as string"
              class="max-h-4 inline-block"
            />&nbsp;</template
          >{{ authors[author_id].name }}
        </span>
      </div>
      <div v-if="book.series.length > 0" class="mb-2">
        <h4 class="inline-block leading-[1.5] font-semibold">{{ t('book.label_in_series') }}</h4>
        {{}}
        <span v-for="(in_series, ix) in book.series" :key="in_series.id">
          <template v-if="ix != 0">, </template>
          {{ series[in_series.id].title }} {{}}
        </span>
      </div>
      <div v-if="book.genres.length > 0" class="mb-2">
        <h4 class="inline-block leading-[1.5] font-semibold">
          {{ book.genres.length === 1 ? t('term.genre') : t('term.genres') }}:
        </h4>
        {{}}
        <span v-for="(genre, ix) in book.genres" :key="genre">
          <template v-if="ix != 0">, </template>
          {{ genre }}
        </span>
      </div>
      <div v-if="book.year > 0" class="mb-2">
        <h4 class="inline-block leading-[1.5] font-semibold">{{ t('book.label_year') }}</h4>
        {{}}
        <span>{{ book.year }}</span>
      </div>
      <ShowMore v-if="about" height="10rem" class="hidden md:block"
        ><div v-html="about"></div
      ></ShowMore>
    </div>
    <ShowMore v-if="about" height="10rem" class="md:hidden"><div v-html="about"></div></ShowMore>
  </div>
</template>
