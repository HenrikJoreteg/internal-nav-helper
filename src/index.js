const findA = el => {
  if (!el) return null
  return el.tagName === 'A' ? el : findA(el.parentElement)
}

const getLocalPathname = a =>
  a.origin === location.origin ? a.href.replace(location.origin, '') : null

export default onInternalNav => e => {
  if (e.button === 0 && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
    const aTag = findA(e.target)
    if (aTag && aTag.target !== '_blank' && aTag.target !== '_external') {
      const url = getLocalPathname(aTag)
      if (url) {
        e.preventDefault()
        onInternalNav(url)
      }
    }
  }
}
