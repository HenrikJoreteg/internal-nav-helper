const test = require('tape')
const navHelper = require('./')

const baseOrigin = 'http://example.com'

const setOrigin = origin => {
  global.location = { origin }
}

const getTarget = ({
  tagName = 'A',
  href = 'http://example.com/hi',
  origin = baseOrigin,
  other
} = {}) =>
  Object.assign(
    {
      tagName,
      href,
      origin,
      parentElement: {}
    },
    other
  )

const getEvent = ({
  origin = baseOrigin,
  href = 'http://example.com/hi',
  tagName = 'A',
  button = 0,
  target,
  other
} = {}) =>
  Object.assign(
    {
      preventDefault: () => {},
      button: 0,
      target: target || getTarget({ tagName, href, origin })
    },
    other
  )

test('test nav helper', t => {
  setOrigin(baseOrigin)
  let called = 0
  const fn = navHelper(url => {
    called++
    if (called === 1) {
      t.equal(url, '/hi')
      return
    } else if (called === 2) {
      t.equal(url, '/hi')
      return
    } else if (called === 3) {
      t.equal(url, '/done')
      t.end()
      return
    }
    t.fail('should never get here')
  })
  // these things *should not* result in callbacks
  fn(getEvent({ origin: 'something' }))
  fn(getEvent({ tagName: 'SPAN' }))
  fn(getEvent({ other: { altKey: true } }))
  fn(getEvent({ target: getTarget({ other: { target: '_blank' } }) }))
  fn(getEvent({ target: getTarget({ other: { target: '_external' } }) }))

  // the following *should* result in callbacks
  fn(getEvent())
  fn(
    getEvent({
      target: {
        parentElement: {
          parentElement: {
            parentElement: getTarget()
          }
        }
      }
    })
  )
  fn(getEvent({ href: baseOrigin + '/done' }))
})
