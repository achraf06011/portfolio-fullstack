import { useEffect } from 'react'

const SITE_URL = 'https://portfolio-fullstack-opal-phi.vercel.app'
const SITE_NAME = 'Achraf Aachchak — Portfolio'
const DEFAULT_DESCRIPTION = "Achraf Aachchak — Développeur Full Stack. Portfolio professionnel."

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function Seo({ title, description = DEFAULT_DESCRIPTION, path = '/', image }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME
    const url = `${SITE_URL}${path}`

    document.title = fullTitle

    setMeta('name', 'description', description)
    setLink('canonical', url)

    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', SITE_NAME)
    if (image) setMeta('property', 'og:image', image)

    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)
    if (image) setMeta('name', 'twitter:image', image)
  }, [title, description, path, image])

  return null
}
