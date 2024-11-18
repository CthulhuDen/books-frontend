import { ref } from 'vue'
import { defineStore } from 'pinia'
import { type Genre, getGenres, showError } from '@/api/client'
import { useI18n } from 'vue-i18n'

export const useGenresStore = defineStore('genres', () => {
  const { t } = useI18n()

  const state = ref('loading')
  const genres = ref<Genre[]>([])

  ;(async () => {
    try {
      genres.value = (await showError(getGenres(), t('message.error.get_genres'))).genres
    } catch (e) {
      state.value = 'failed'
      throw e
    }

    state.value = 'loaded'
  })()

  const byCode = (code: string) => {
    const ix = genres.value.findIndex((g) => g.code == code)
    return ix === -1 ? null : genres.value[ix]
  }

  return { state, genres, byCode }
})
