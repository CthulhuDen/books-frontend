<script setup lang="ts">
import FormControl from '@/components/common/FormControl.vue'
import ComboBox from '@/components/common/ComboBox.vue'
import { onMounted, ref, watchEffect } from 'vue'
import { getGenres, showError } from '@/api/client'
import { navSet, useNavigateListener } from '@/utils/navigate'
import { arrayEquals } from '@/utils/helpers'
import { useI18n } from 'vue-i18n'

const model = ref<string[]>([])

useNavigateListener(
  'genre',
  (genres: string[]) => {
    if (!arrayEquals(genres, model.value)) {
      model.value = genres
    }
  },
  true
)

const emit = defineEmits(['input'])
watchEffect(() => {
  navSet('genre', ...model.value)
  emit('input', model.value)
})

const removeGenre = (genre: string) => {
  model.value = model.value.filter((g) => g !== genre)
}

const { t } = useI18n()

const genresState = ref('loading')
const genres = ref<Array<string>>([])

onMounted(async () => {
  genresState.value = 'loading'

  try {
    genres.value = (await showError(getGenres(), t('message.error.get_genres'))).titles
  } catch (e) {
    genresState.value = 'failed'
    throw e
  }
  genresState.value = 'loaded'
})
</script>

<template>
  <div class="flex flex-wrap md:flex-nowrap gap-4">
    <FormControl
      :label="model.length > 0 ? t('search.genre.label') : t('search.genre.label_more')"
      class="w-full md:w-60 lg:w-80 shrink-0 self-start relative"
    >
      <ComboBox
        v-if="genresState == 'loaded'"
        v-model="model"
        :items="genres"
        multiple
        width="w-full"
      />
      <input
        v-else-if="genresState === 'failed'"
        type="text"
        class="input input-disabled"
        value="Failed to load genres"
      />
      <input v-else type="text" class="input input-disabled" :value="t('search.genre.loading')" />
    </FormControl>
    <div class="grow shrink basis-0 max-w-full">
      <span class="label md:flex" :class="{ hidden: model.length == 0 }">
        <span
          class="label-text"
          :class="{
            'whitespace-nowrap': model.length === 0,
            'w-0': model.length === 0,
            'overflow-hidden': model.length === 0
          }"
        >
          {{ t('search.genre.label_tags') }}
        </span>
      </span>
      <div class="flex flex-wrap gap-2">
        <p v-if="model.length === 0">{{ t('search.genre.text_tags') }}</p>
        <button
          v-for="genre in model"
          :key="genre"
          class="badge badge-accent badge-outline bg-base-200 flex-none group whitespace-nowrap overflow-hidden max-w-[99%] justify-start"
          @click="removeGenre(genre)"
          :title="t('search.genre.button_remove')"
        >
          <span class="text-base-content">{{ genre }}</span>
          <span class="px-1 mr-[-0.5rem] text-base-200 group-hover:text-secondary">&times;</span>
        </button>
      </div>
    </div>
  </div>
</template>
