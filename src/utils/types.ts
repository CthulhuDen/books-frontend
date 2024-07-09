import type { Book, BookGrouping } from '@/api/client'

export type BooksGroup = {
  group: BookGrouping
  books: BooksCollection
}

export type BooksCollection =
  | { type: 'plain'; books: Book[] }
  | { type: 'grouped'; groups: BooksGroup[] }
