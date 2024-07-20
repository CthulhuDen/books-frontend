<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps({
  height: { type: String, default: '10rem' }
})

const container = ref<Element>()
const ruler = ref<Element>()
const html = ref<Element>()

const contentHeight = ref()
const rulerHeight = ref()
const expanded = ref(false)

let checkSize = new ResizeObserver((entries) => {
  for (let entry of entries) {
    if (entry.target === ruler.value) {
      rulerHeight.value = entry.contentBoxSize[0].blockSize
    } else if (entry.target === html.value) {
      contentHeight.value = entry.contentBoxSize[0].blockSize
    }
  }
})

onMounted(() => {
  checkSize.observe(html.value as Element)
  checkSize.observe(ruler.value as Element)
})

onBeforeUnmount(() => {
  checkSize.unobserve(html.value as Element)
  checkSize.unobserve(ruler.value as Element)
})

const canOverflow = computed(
  () => rulerHeight.value && contentHeight.value && contentHeight.value > rulerHeight.value
)

watchEffect(() => {
  if (!canOverflow.value) {
    expanded.value = false
  }
})

const { t } = useI18n()
</script>

<template>
  <div>
    <div
      class="overflow-y-hidden relative"
      :style="{ 'max-height': expanded ? undefined : height }"
      ref="container"
    >
      <div ref="ruler" style="position: absolute; width: 0" :style="{ height: height }"></div>
      <div class="prose" ref="html">
        <slot />
      </div>
    </div>
    <div
      class="divider !gap-0 before:bg-current before:h-[1px] before:opacity-50 after:bg-current after:h-[1px] after:opacity-50"
      v-show="canOverflow"
    >
      <button class="btn btn-outline btn-sm rounded-badge" @click="expanded = !expanded">
        <svg
          v-if="expanded"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="size-4 inline"
        >
          <path
            fill-rule="evenodd"
            d="M7.47 3.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1-1.06 1.06L8 4.81 5.28 7.53a.75.75 0 0 1-1.06-1.06l3.25-3.25Zm-3.25 8.25 3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 1 1-1.06 1.06L8 9.81l-2.72 2.72a.75.75 0 0 1-1.06-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="size-4"
        >
          <path
            fill-rule="evenodd"
            d="M7.47 12.78a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 0 0-1.06-1.06L8 11.19 5.28 8.47a.75.75 0 0 0-1.06 1.06l3.25 3.25ZM4.22 4.53l3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 0 0-1.06-1.06L8 6.19 5.28 3.47a.75.75 0 0 0-1.06 1.06Z"
            clip-rule="evenodd"
          />
        </svg>

        {{ expanded ? t('component.show_more.button_less') : t('component.show_more.button_more') }}
      </button>
    </div>
  </div>
</template>
