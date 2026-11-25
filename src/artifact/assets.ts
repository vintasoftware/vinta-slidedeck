/* Swaps /assets/... paths for data URIs in the self-contained artifact (npm run build-deck).
   The patterns reference images in public/ by string (src, href, inline style), so build-deck cannot
   rewrite them in the bundle: it embeds the path → data URI map as `window.__DECK_ASSETS__` and this
   observer swaps the attributes as soon as React writes them to the DOM. Ported from vinta-slidedeck-deprecated.
   Imported first by the artifact entry, so it is installed before the deck renders; a no-op elsewhere. */

declare global {
  interface Window {
    /** Path → data URI map that build-deck embeds in the HTML. */
    __DECK_ASSETS__?: Record<string, string>
  }
}

const CSS_URL = /url\((['"]?)(\/assets\/[^'")]+)\1\)/g

function installAssetMap(map: Record<string, string>) {
  const lookup = (path: string) => map[path] ?? map[safeDecode(path)]

  const fix = (el: Element) => {
    for (const attr of Array.from(el.attributes)) {
      const value = attr.value
      if (attr.name === 'style') {
        if (!value.includes('/assets/')) continue
        const next = value.replace(CSS_URL, (match, _q, path: string) => {
          const data = lookup(path)
          return data ? `url("${data}")` : match
        })
        if (next !== value) attr.value = next
      } else if (value.startsWith('/assets/')) {
        const data = lookup(value)
        if (data) attr.value = data // Attr.value keeps the namespace (xlink:href)
      }
    }
  }

  const fixTree = (root: Element) => {
    fix(root)
    root.querySelectorAll('*').forEach(fix)
  }

  new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'attributes') fix(record.target as Element)
      else record.addedNodes.forEach((node) => node instanceof Element && fixTree(node))
    }
  }).observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['src', 'href', 'poster', 'style'],
  })
  fixTree(document.documentElement)
}

function safeDecode(path: string) {
  try {
    return decodeURIComponent(path)
  } catch {
    return path
  }
}

if (window.__DECK_ASSETS__) installAssetMap(window.__DECK_ASSETS__)

export {}
