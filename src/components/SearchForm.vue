<script setup lang="ts">
import FormControl from '@/components/common/FormControl.vue'
import { ref, watchEffect } from 'vue'
import GenresPicker from '@/components/search/GenresPicker.vue'
import AuthorPicker from '@/components/search/AuthorPicker.vue'
import SeriesPicker from '@/components/search/SeriesPicker.vue'
import type { SearchBooksQuery } from '@/api/client'
import BooksGroupOptions from '@/components/search/BooksGroupOptions.vue'
import { navSet, useNavigateListener } from '@/utils/navigate'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['input'])

const query = ref<NonNullable<SearchBooksQuery>>({})

useNavigateListener('search', (val: string | null) => (query.value.search = val || ''))
useNavigateListener('year_min', (val: string | null) => {
  if (val === null) {
    delete query.value.year_min
    return
  }
  query.value.year_min = parseInt(val)
})
useNavigateListener('year_max', (val: string | null) => {
  if (val === null) {
    delete query.value.year_max
    return
  }
  query.value.year_max = parseInt(val)
})

watchEffect(() => navSet('search', query.value.search || ''))
watchEffect(() => navSet('year_min', query.value.year_min ? query.value.year_min.toString() : ''))
watchEffect(() => navSet('year_max', query.value.year_max ? query.value.year_max.toString() : ''))

const setIntAttr = (ev: Event, attr: 'year_min' | 'year_max') => {
  if (!ev.target) {
    delete query.value[attr]
    return
  }
  const target = ev.target as HTMLInputElement
  if (!target.valueAsNumber || isNaN(target.valueAsNumber)) {
    delete query.value[attr]
    return
  }
  query.value[attr] = target.valueAsNumber
}

watchEffect(() => {
  emit('input', query.value)
})

const { t } = useI18n()
</script>

<template>
  <div class="card bg-base-200 p-4 md:p-5 mx-[-1rem] md:mx-0">
    <h3 class="leading-[1.6] text-xl font-semibold">{{ t('term.genres') }}</h3>
    <GenresPicker @input="(genres) => (query.genre = genres)" class="mb-5" />

    <h3 class="leading-[1.6] text-xl font-semibold">{{ t('term.author') }}</h3>
    <AuthorPicker
      @input="(author) => (query.author = author)"
      :genres="query.genre || []"
      class="mb-5"
    />

    <h3 class="leading-[1.6] text-xl font-semibold">{{ t('term.books') }}</h3>
    <div class="flex flex-wrap gap-4 mb-5">
      <FormControl
        :label="t('search.books.label_title')"
        class="w-full md:w-auto md:basis-0 md:grow-[1.5] md:shrink-0"
      >
        <input
          type="text"
          v-model="query.search"
          class="input bg-base-200 flex-grow"
          :class="{ 'input-primary': !query.search, 'input-accent': !!query.search }"
        />
      </FormControl>
      <SeriesPicker
        class="w-full md:w-auto md:basis-0 md:grow-[1.5] md:shrink-0"
        @input="(series) => (query.series = series)"
        :genres="query.genre || []"
        :author="query.author"
      />
      <FormControl
        :label="t('search.books.label_year')"
        class="w-full md:w-auto md:basis-0 md:grow md:shrink-0"
      >
        <input
          type="number"
          :placeholder="t('search.books.placeholder_year_from')"
          :value="query.year_min"
          @input="(ev) => setIntAttr(ev, 'year_min')"
          class="input bg-base-200 w-1 flex-grow"
          :class="{ 'input-primary': !query.year_min, 'input-accent': !!query.year_min }"
        />
        <span
          class="mx-1 leading-[3rem] before:content-[attr(data-before)]"
          data-before="&mdash;"
        ></span>
        <input
          type="number"
          :placeholder="t('search.books.placeholder_year_to')"
          :value="query.year_max"
          @input="(ev) => setIntAttr(ev, 'year_max')"
          class="input bg-base-200 w-1 flex-grow"
          :class="{ 'input-primary': !query.year_max, 'input-accent': !!query.year_max }"
        />
      </FormControl>
    </div>

    <h3 class="leading-[1.6] text-xl font-semibold">{{ t('term.options') }}</h3>
    <div class="flex flex-wrap gap-4">
      <BooksGroupOptions
        @input="(groups) => (query.group = groups)"
        class="w-full md:w-auto md:basis-0 md:grow-[3] xl:grow-[1.5] md:shrink-0"
      />
      <div class="basis-0 md:grow-[1] xl:grow-[2.5]"></div>
    </div>
  </div>
</template>
