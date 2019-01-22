const test = require('tape')
const getNavHelper = require('./dist').getNavHelper

const baseHost = 'example.com'

const setHost = host => {
  global.location = { host, protocol: 'http:' }
}

const getTarget = ({
  tagName = 'A',
  href = 'http://example.com/hi',
  other
} = {}) =>
  Object.assign(
    {
      tagName,
      href,
      parentElement: {},
      hasAttribute: name => !!(other && other[name])
    },
    other
  )

const getEvent = ({
  href = 'http://example.com/hi',
  tagName = 'A',
  target,
  other
} = {}) =>
  Object.assign(
    {
      preventDefault: () => {},
      button: 0,
      target: target || getTarget({ tagName, href })
    },
    other
  )

test('test nav helper', t => {
  t.plan(3)
  setHost(baseHost)
  let called = 0
  const fn = getNavHelper(url => {
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
  fn(getEvent({ tagName: 'SPAN' }))
  fn(getEvent({ other: { altKey: true } }))
  fn(getEvent({ target: getTarget({ other: { target: '_blank' } }) }))
  fn(getEvent({ target: getTarget({ other: { target: '_external' } }) }))
  fn(getEvent({ target: getTarget({ other: { download: 'file.csv' } }) }))

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
  fn(getEvent({ href: 'http://' + baseHost + '/done' }))
})
