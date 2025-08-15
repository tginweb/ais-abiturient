import {dom, scroll} from 'quasar'
const {getScrollTarget, setScrollPosition} = scroll

export default function ({el, target, offset, duration}) {

  if (typeof el === 'string') el = document.querySelector(el)

  if (!el) return;

  target = getScrollTarget(el, target)

  let elOffset;

  if (target === window) {
    elOffset = dom.offset(el).top + document.documentElement.scrollTop
  } else {
    elOffset = el.offsetTop
  }

  elOffset -= offset || 0

  setScrollPosition(target, elOffset, duration ? (typeof duration === 'boolean' ? 300 : duration) : null)
}

