import { GqlQuery } from  './gql.query'

export default {
  data() {
    return {
      queries: {

      }
    }
  },
  computed: {},
  watch: {},
  methods: {

    registerQuery(name, options) {

      let query

      if (!this.queries) this.queries = {}

      if (typeof name === 'object') {
        query = name
        this.queries[query.name] = query
      } else {
        query = new GqlQuery(this, name, options)
        this.queries[name] = query
      }

      return query
    }
  },

  beforeDestroy() {
    if (this.queries) {
      for (let name in this.queries) {
        this.queries[name].destroy();
      }
    }
  }
}

