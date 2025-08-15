import {dom, scroll} from 'quasar'
const {getScrollTarget, setScrollPosition} = scroll

export default function (duration) {
  setScrollPosition(window, 0, duration || 300)
}
