export const findAnchorTag = el => {
  if (!el) return null
  return el.tagName === 'A' ? el : findAnchorTag(el.parentElement)
}

const getLocalPathname = a =>
  a.href.indexOf(location.protocol + '//' + location.host) !== -1
    ? a.href.split(location.host, 2)[1]
    : null

export const getNavHelper = onInternalNav => e => {
  if (e.button === 0 && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
    const aTag = findAnchorTag(e.target)

    if (
      aTag &&
      aTag.target !== '_blank' &&
      aTag.target !== '_external' &&
      aTag.rel !== 'external' &&
      !aTag.hasAttribute('download')
    ) {
      const url = getLocalPathname(aTag)
      if (url) {
        e.preventDefault()
        onInternalNav(url)
      }
    }
  }
}
