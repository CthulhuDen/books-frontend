<script setup lang="ts">
import FormControl from '@/components/common/FormControl.vue'
import ComboBox from '@/components/common/ComboBox.vue'
import { computed, ref, watchEffect } from 'vue'
import { type Author, getAuthor, searchAuthors, showError } from '@/api/client'
import { sanitize } from '@/utils/html'
import ShowMore from '@/components/common/ShowMore.vue'
import { navSet, useNavigateListener } from '@/utils/navigate'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  genres: { type: Array<string>, required: true }
})

const { t } = useI18n()

const getAuthors = async (query: string) =>
  (
    await showError(
      searchAuthors({ genre: props.genres, search: query }),
      t('message.error.search_authors')
    )
  ).authors

const author = ref<Author | null>(null)

let currentQuery: {}
const status = ref<'loading' | 'ready'>('ready')
useNavigateListener('author', async (val: string | null) => {
  const thisQuery = (currentQuery = {})

  if ((val || '') === (author.value ? author.value.id.toString() : '')) {
    status.value = 'ready'
    return
  }

  if (val === null) {
    author.value = null
    status.value = 'ready'
    return
  }

  status.value = 'loading'

  const ret = await showError(getAuthor(parseInt(val)), t('message.error.get_author'))
  if (thisQuery !== currentQuery) {
    return
  }

  author.value = ret.author
  status.value = 'ready'
})

const emit = defineEmits(['input'])
watchEffect(() => {
  if (status.value !== 'ready') {
    return
  }
  navSet('author', author.value ? author.value.id.toString() : '')
  emit('input', author.value ? author.value.id : 0)
})

const bio = computed(() => (author.value ? sanitize(author.value.bio || '') : ''))
</script>

<template>
  <div class="flex flex-wrap md:flex-nowrap gap-4">
    <FormControl
      :label="t('search.author.label')"
      class="w-full md:w-60 lg:w-80 shrink-0 self-start relative"
      :can-clear="!!author"
      @clear="author = null"
    >
      <ComboBox
        v-if="status === 'ready'"
        v-model="author"
        :items="getAuthors"
        :text-value="(item: Author | undefined) => (item ? item.name : '')"
        by="id"
        width="w-full"
        nullable
      >
        <template v-slot:item="{ item }">
          <a>
            <img v-if="item.avatar_url" :src="item.avatar_url" class="max-h-5" />
            {{ item.name }}
          </a>
        </template>
      </ComboBox>
      <input v-else type="text" class="input input-disabled" :value="t('search.author.loading')" />
    </FormControl>
    <ShowMore class="grow">
      <div class="bio" v-html="bio"></div>
    </ShowMore>
  </div>
</template>

<style scoped>
.bio:deep(> p:first-child),
.bio:deep(> img:first-child + p) {
  margin-top: 0;
}
.bio:deep(> p:last-child) {
  margin-bottom: 0;
}
.bio:deep(> img) {
  max-height: 150px;
}
</style>
