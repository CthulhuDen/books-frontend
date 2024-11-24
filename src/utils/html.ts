import DOMPurify from 'dompurify'

DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  if (node instanceof HTMLAnchorElement) {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener')
  }
})

export const sanitize = (html: string) =>
  DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true }
  })
