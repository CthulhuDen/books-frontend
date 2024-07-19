import { useI18n } from 'vue-i18n'

export const tl = (items: string[]) => {
  const { t } = useI18n()

  items = items.filter((item) => item.trim() !== '')

  let output = ''
  for (let ix = 0; ix < items.length; ix += 1) {
    const item = items[ix].trim()

    if (output === '') {
      output = item
      continue
    }

    output =
      ix + 1 === items.length
        ? t('list.append_last', { items: output, item })
        : t('list.append', { items: output, item })
  }

  return output
}
