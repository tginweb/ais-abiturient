export default function classToArray(val) {

  if (val) {
    if (typeof val === 'object') {
      if (Array.isArray(val)) {
        return val
      } else {
        return Object.keys(val)
      }
    } else if (typeof val === 'string') {
      return val.split(' ')
    }
  }

  return []
}
