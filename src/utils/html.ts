import DOMPurify from 'dompurify'

export const sanitize = (html: string) => DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
