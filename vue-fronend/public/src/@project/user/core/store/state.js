export default function () {
  return {

    app: {
      avatarElements: [],
    },

    user: {
      token: null,
      user: null
    },

    scopes: {
      sess: {
        fetched: false,
      },
      user: {
        fetched: false,
      }
    },

  }
}
