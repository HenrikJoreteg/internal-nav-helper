# internal-nav-helper

![](https://img.shields.io/npm/dm/internal-nav-helper.svg)![](https://img.shields.io/npm/v/internal-nav-helper.svg)![](https://img.shields.io/npm/l/internal-nav-helper.svg)

Helper function for handling internal navigation in Single Page Apps (SPAs) in ~250 bytes before gzip.

Since events bubble you add a single click handler at the root of your app and then use this little utility to determine if it should be considered an internal navigation event. If it _is_ internal it calls the function you supplied it. That's it!

### How it works

It works by examining the event and event target. First it makes sure this was a left click (button `0`) and that no modifier keys were being pressed (shift, ctrl, etc). If the event qualifies as a basic click, then it examines the `event.target`. It looks for an `<a>` tag first on the target element itself, then starts walking up the element tree looking to see if the target was wrapped in an `<a>` tag. If it finds one with an origin that matches `window.location.origin` and that doesn't have a `target='_blank'` or a `target='_external'` on it, then it's considered an internal navigation and calls the function you supplied with the new pathname.

### Why would you want this?

1. Instead of using some `<Link/>` abstraction, you can just use plain old, `<a/>` tags anywhere in your app. This means, that everything that browsers do with a links, still works. Like when you hover them it shows the actual URL, etc.
2. It's puny at only ~250 bytes (before gzip)!
3. If for some reason your JS fails, it will navigate as usual because you're using real links in your app.
4. It won't mess with normal browser behavior, so it will never consider a CTRL+click, right-click, or clicking a tag with a `target="_blank"` to be an internal navigation event.
5. It's not tied to any framework, as long as you have some sort of function to call for setting a pathname you're good.
6. Because there's very little magic, it promotes understanding of how these things actually work.

## install

```
npm install internal-nav-helper
```

## example

This works with any framework it's just inspecting DOM events. But I like Preact and [redux-bundler](https://github.com/henrikjoreteg/redux-bundler) so here's an example for that setup:

```js
import { h } from 'preact'
import { connect } from 'redux-bundler-connect'
const navHelper = require('internal-nav-helper')

const RootComponent = ({ doUpdateUrl }) => (
  <div onClick={navHelper(doUpdateUrl)}>
    <h1>Your app</h1>
    <a href="/something">Some internal link will be handled</a>
    <a href="/other" target="_blank">
      An internal link that should open in new window
    </a>
    <a href="/same-origin-different-app" target="_external">
      Technically same origin, but will be ignored because of
      `target="_external"`
    </a>
    <a href="http://joreteg.com">
      An external link it will not try to handle this
    </a>
  </div>
)

export default connect(
  'doUpdateUrl',
  RootComponent
)
```

## changelog

- `1.1.0` now ignores links with `download` attribute (thanks [@huygn](https://github.com/huygn)). Updated dependencies. Removed sourcemaps (seemed unnecessary).
- `1.0.2` fixed issues in IE.

## credits

If you like this follow [@HenrikJoreteg](http://twitter.com/henrikjoreteg) on twitter.

## license

[MIT](http://mit.joreteg.com/)
