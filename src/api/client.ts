import type { components, paths } from '@/api/schema'
import createClient from 'openapi-fetch'
import { useToastsStore } from '@/stores/toasts'

const client = createClient<paths>({ baseUrl: '/api' })

const requireData = async <T>(p: Promise<{ data?: T; error?: any }>) => {
  const { data, error } = await p
  if (typeof error !== 'undefined') {
    throw error
  }

  return data as T
}

export const showError = async <T>(promise: Promise<T>, prefix: string) => {
  try {
    return await promise
  } catch (e) {
    useToastsStore().add({ type: 'error', message: prefix + ': ' + e })
    throw e
  }
}

export const getGenres = async () => requireData(client.GET('/genres'))

type SearchAuthorsQuery = paths['/authors']['get']['parameters']['query']

export type Author = components['schemas']['Author']

export const searchAuthors = async (query: SearchAuthorsQuery) =>
  requireData(client.GET('/authors', { params: { query } }))

export const getAuthor = async (id: string) =>
  requireData(client.GET('/authors/{id}', { params: { path: { id } } }))

type SearchSeriesQuery = paths['/series']['get']['parameters']['query']

export type Series = components['schemas']['Series']

export const searchSeries = async (query: SearchSeriesQuery) =>
  requireData(client.GET('/series', { params: { query } }))

export const getSeries = async (id: string) =>
  requireData(client.GET('/series/{id}', { params: { path: { id } } }))

export type BookGroupingType = components['schemas']['BooksGroupingType']
export type SearchBooksQuery = paths['/books']['get']['parameters']['query']

export type Book = components['schemas']['Book']

export type BookInGroup = components['schemas']['BookInGroup']
export type BookGrouping = BookInGroup['groups'][0]
export type SearchBooksResponse =
  paths['/books']['get']['responses'][200]['content']['application/json']

export const searchBooks = async (query: SearchBooksQuery, abort?: AbortController) =>
  requireData(client.GET('/books', { params: { query }, signal: abort ? abort.signal : null }))
