<script setup lang="ts">
import FormControl from '@/components/common/FormControl.vue'
import ComboBox from '@/components/common/ComboBox.vue'
import { getSeries, searchSeries, type Series, showError } from '@/api/client'
import { ref, watchEffect } from 'vue'
import { navSet, useNavigateListener } from '@/utils/navigate'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  genres: { type: Array<string>, required: true },
  author: { type: String }
})

const getSequences = async (query: string) =>
  (
    await showError(
      searchSeries({ genre: props.genres, author: props.author, search: query }),
      t('message.error.search_series')
    )
  ).sequences

const { t } = useI18n()

const series = ref<Series>()

let currentQuery: {}
const status = ref<'loading' | 'ready'>('ready')
useNavigateListener('series', async (val: string | null) => {
  const thisQuery = (currentQuery = {})

  if ((val || '') === (series.value ? series.value.id : '')) {
    status.value = 'ready'
    return
  }

  if (val === null) {
    series.value = undefined
    status.value = 'ready'
    return
  }

  status.value = 'loading'

  const ret = await showError(getSeries(val), t('message.error.get_series'))
  if (thisQuery !== currentQuery) {
    return
  }

  series.value = ret.series
  status.value = 'ready'
})

const emit = defineEmits(['input'])
watchEffect(() => {
  if (status.value === 'ready') {
    navSet('series', series.value ? series.value.id : '')
  }
  emit('input', series.value ? series.value.id : '')
})
</script>

<template>
  <FormControl :label="t('search.series.label')" class="shrink-0 self-start relative">
    <ComboBox
      v-if="status === 'ready'"
      v-model="series"
      :items="getSequences"
      :text-value="(item: Series | undefined) => (item ? item.title : '')"
      by="id"
      width="w-full"
      nullable
    >
      <template v-slot:item="{ item }">
        <a>{{ item.title }}</a>
      </template>
    </ComboBox>
    <input v-else type="text" class="input input-disabled" :value="t('search.series.loading')" />
  </FormControl>
</template>
