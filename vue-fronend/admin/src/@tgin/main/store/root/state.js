export default function () {
  return {

    scopes: {

    },

    httpHeaders: {
      fullPath: typeof window !== 'undefined' ? window.location.href : null
    }
  }
}
