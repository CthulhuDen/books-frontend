import { onBeforeMount, onMounted } from 'vue'
import { arrayEquals } from '@/utils/helpers'

export const navGetAll = (key: string): string[] => {
  const h = window.location.hash
  if (h.length <= 1) {
    return []
  }

  const url = new URLSearchParams(h.substring(1))

  return url.getAll(key)
}

export const navGet = (key: string): string | null => {
  const ret = navGetAll(key)
  return ret.length >= 1 ? ret[0] : null
}

export const navSet = (key: string, ...vals: string[]) => {
  const h = window.location.hash
  const url = h.length <= 1 ? new URLSearchParams() : new URLSearchParams(h.substring(1))

  let num_filtered = 0
  for (const val of vals) {
    if (val === '') {
      continue
    }

    vals[num_filtered] = val
    num_filtered += 1
  }
  vals = vals.slice(0, num_filtered)

  const old_vals = url.getAll(key)
  if (arrayEquals(old_vals, vals)) {
    return
  }

  url.delete(key)
  for (const val of vals) {
    url.append(key, val)
  }

  window.location.hash = url.size > 0 ? '#' + url.toString() : ''
}

export function useNavigateListener(
  key: string,
  handler: (vals: string[]) => void,
  multi: true
): void
export function useNavigateListener(
  key: string,
  handler: (val: string | null) => void,
  multi: false
): void
export function useNavigateListener(key: string, handler: (val: string | null) => void): void
export function useNavigateListener(key: string, handler: Function, multi: boolean = false): void {
  const h = () => {
    handler(multi ? navGetAll(key) : navGet(key))
  }

  onMounted(() => window.addEventListener('hashchange', h))
  onBeforeMount(() => window.removeEventListener('hashchange', h))

  h()
}
