<script setup lang="ts">
import FormControl from '@/components/common/FormControl.vue'
import ComboBox from '@/components/common/ComboBox.vue'
import { computed, ref, watchEffect } from 'vue'
import { type Genre } from '@/api/client'
import { navGetAll, navSet, useNavigateListener } from '@/utils/navigate'
import { arrayEquals } from '@/utils/helpers'
import { useI18n } from 'vue-i18n'
import { useGenresStore } from '@/stores/genres'
import { storeToRefs } from 'pinia'

const model = ref<Genre[]>([])
const modelGroups = computed((): string[] => {
  let keys = new Set<string>()
  for (let genre of model.value) {
    if (!keys.has(genre.group_title)) {
      keys.add(genre.group_title)
    }
  }

  const ret = Array.from(keys.values())
  ret.sort()

  return ret
})
const updateModelGroups = (groups: string[]) => {
  const groupsLocal = Array.from(groups)
  groupsLocal.sort()

  const newModel = []

  for (let group of groupsLocal) {
    const isOld = modelGroups.value.includes(group)
    for (let genre of genresByGroups.value[group]) {
      if (!isOld || model.value.some((genreOld) => genreOld.code === genre.code)) {
        newModel.push(genre)
      }
    }
  }

  model.value = newModel
}

const removeGenre = (code: string) => {
  model.value = model.value.filter((g) => g.code !== code)
}

const { t } = useI18n()

const { genres, state: genresState } = storeToRefs(useGenresStore())

watchEffect(() => {
  if (genresState.value !== 'loaded') {
    return
  }

  const genresLocal = navGetAll('genre')
  genresLocal.sort()

  const newModel = []
  for (let group in genresByGroups.value) {
    for (let genre of genresByGroups.value[group]) {
      if (genresLocal.includes(genre.code)) {
        newModel.push(genre)
      }
    }
  }

  model.value = newModel
})

const genreGroups = computed(() => {
  const ret = Object.getOwnPropertyNames(genresByGroups.value)
  ret.sort()

  return ret
})
const genresByGroups = computed(() => {
  const ret: Record<string, Genre[]> = {}
  for (let genre of genres.value) {
    if (!Object.hasOwn(ret, genre.group_title)) {
      ret[genre.group_title] = []
    }
    ret[genre.group_title].push({ ...genre })
  }
  for (let group of Object.getOwnPropertyNames(ret)) {
    ret[group].sort()
  }
  return ret
})

const emit = defineEmits(['input'])
watchEffect(() => {
  if (genresState.value !== 'loaded') {
    return
  }

  const codes = model.value.map((genre) => genre.code)
  navSet('genre', ...codes)
  emit('input', codes)
})

useNavigateListener(
  'genre',
  (genres: string[]) => {
    if (genresState.value !== 'loaded') {
      return
    }

    const genresLocal = Array.from(genres)
    genresLocal.sort()

    if (
      arrayEquals(
        genresLocal,
        model.value.map((g) => g.code)
      )
    ) {
      return
    }

    const newModel = []
    for (let group in genresByGroups.value) {
      for (let genre of genresByGroups.value[group]) {
        if (genresLocal.includes(genre.code)) {
          newModel.push(genre)
        }
      }
    }

    model.value = newModel
  },
  true
)
</script>

<template>
  <div class="flex flex-wrap md:flex-nowrap gap-4">
    <FormControl
      :label="model.length > 0 ? t('search.genre.label_more') : t('search.genre.label')"
      :can-clear="model.length > 0"
      @clear="model = []"
      class="w-full md:w-60 lg:w-80 shrink-0 self-start relative"
    >
      <ComboBox
        v-if="genresState == 'loaded'"
        :items="genreGroups"
        :model-value="modelGroups"
        @update:model-value="updateModelGroups"
        multiple
        width="w-full"
      />
      <input
        v-else-if="genresState === 'failed'"
        type="text"
        class="input input-disabled"
        :value="t('message.error.get_genres')"
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
          :key="genre.code"
          class="badge badge-accent badge-outline bg-base-200 flex-none group whitespace-nowrap overflow-hidden max-w-[99%] justify-start"
          @click="removeGenre(genre.code)"
          :title="t('search.genre.button_remove', { label: genre.title })"
        >
          <span class="text-base-content">{{ genre.title }}</span>
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
      </div>
    </div>
  </div>
</template>
