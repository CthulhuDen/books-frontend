/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/genres': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get all genres */
    get: {
      parameters: {
        query?: never
        header?: never
        path?: never
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description Successful response */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': {
              genres: components['schemas']['Genre'][]
            }
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/authors/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get author by ID */
    get: {
      parameters: {
        query?: never
        header?: never
        path: {
          id: components['schemas']['AuthorId']
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description Successful response */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': {
              author: components['schemas']['Author']
            }
          }
        }
        /** @description Author not found */
        404: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': {
              author: null
            }
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/authors': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Search authors */
    get: {
      parameters: {
        query?: {
          /** @description Term to search in the author name */
          search?: string
          /** @description Multiple genre codes can be provided */
          genre?: components['schemas']['GenreCode'][]
          limit?: number
        }
        header?: never
        path?: never
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description Successful response */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': {
              authors: components['schemas']['Author'][]
            }
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/series/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get series by ID */
    get: {
      parameters: {
        query?: never
        header?: never
        path: {
          id: components['schemas']['SeriesId']
        }
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description Successful response */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': {
              series: components['schemas']['Series']
            }
          }
        }
        /** @description Series not found */
        404: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': {
              series: null
            }
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/series': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Search series */
    get: {
      parameters: {
        query?: {
          /** @description Term to search in the series title */
          search?: string
          author?: components['schemas']['AuthorId']
          /** @description Multiple genre codes can be provided */
          genre?: components['schemas']['GenreCode'][]
          limit?: number
        }
        header?: never
        path?: never
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description Successful response */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': {
              sequences: components['schemas']['Series'][]
            }
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/books': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Search books */
    get: {
      parameters: {
        query?: {
          /** @description Term to search in the book title */
          search?: string
          author?: components['schemas']['AuthorId']
          /** @description Multiple genre codes can be provided */
          genre?: components['schemas']['GenreCode'][]
          series?: components['schemas']['SeriesId']
          year_min?: number
          year_max?: number
          limit?: number
          offset?: number
          /** @description Multiple grouping types can be provided */
          group?: components['schemas']['BooksGroupingType'][]
        }
        header?: never
        path?: never
        cookie?: never
      }
      requestBody?: never
      responses: {
        /** @description Successful response */
        200: {
          headers: {
            [name: string]: unknown
          }
          content: {
            'application/json': {
              books: components['schemas']['BookInGroup'][]
              authors: {
                [key: string]: components['schemas']['Author']
              }
              series: {
                [key: string]: components['schemas']['Series']
              }
            }
          }
        }
      }
    }
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}

export type webhooks = Record<string, never>

export interface components {
  schemas: {
    GenreCode: string
    Genre: {
      code: components['schemas']['GenreCode']
      title: string
      group_title: string
    }
    /** @enum {string} */
    BooksGroupingType: 'author' | 'genres' | 'series'
    /** Format: uint */
    AuthorId: number
    Author: {
      id: components['schemas']['AuthorId']
      name: string
      bio?: string | null
      avatar_url?: string | null
    }
    /** Format: uint */
    SeriesId: number
    Series: {
      id: components['schemas']['SeriesId']
      title: string
    }
    InSeries: {
      id: components['schemas']['SeriesId']
      /** Format: uint */
      order: number
    }
    Book: {
      /** Format: uint */
      id: number
      title: string
      /** @description Unique and sorted by (unspecified priority in the source) */
      author_ids: components['schemas']['AuthorId'][]
      series: components['schemas']['InSeries'][]
      /** @description Unique and sorted by alphabet */
      genres: components['schemas']['GenreCode'][]
      language: string
      /** Format: uint16 */
      year: number
      file_type: string
      about?: string | null
      cover_url?: string | null
    }
    BookInGroup: {
      book: components['schemas']['Book']
      groups: (
        | {
            /** @enum {string} */
            type: 'author' | 'series'
            /** Format: uint */
            value: number
          }
        | {
            /** @enum {string} */
            type: 'genres'
            value: components['schemas']['GenreCode'][]
          }
      )[]
    }
  }
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}

export type $defs = Record<string, never>
export type operations = Record<string, never>
