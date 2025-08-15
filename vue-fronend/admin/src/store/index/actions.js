const setCookieParser = require('set-cookie-parser');
import combineQuery from 'graphql-combine-query'
import app from '../../boot/app'

function modulesRunHooks(data, context) {
  for (let key in data) {
    let [type, module, name] = key.split('__')
    if (type === 'dispatch') {
      context.dispatch(module + '/' + name, data[key]);
    } else {
      context.commit(module + '/' + name, data[key]);
    }
  }
}

export function fetchStateCommon(context, authorized) {

  return new Promise(async (resolve, reject) => {

    let query = combineQuery('res');

    const {document, variables} = query

    try {

      let res = await this.apollo.defaultClient.query({query: document})

      const results = {}

      for (let key in res.data) {
        let [module, name] = key.split('__')
        const result = res.data[key]

        if (!results[module])
          results[module] = {}

        results[module][name] = result
      }

      for (let module in results) {
        await context.dispatch(module + '/stateInit', results[module]);
      }

    } catch (e) {
      console.log(e)
      reject(e)
      return
    }

    if (this.ssrContext) {

      console.log('SERVER ONLY')

      /*
      try {

        const res = await this.$api.get('/main/session/state')

        let resCookies = setCookieParser.parse(res);

        for (var i = 0; i < resCookies.length; i++) {

          let item = resCookies[i];

          this.$q.cookies.set(item.name, item.value, { path: '/',   expires: item.maxAge })
        }

      } catch (e) {
        console.log(e)
      }

       */

    }

    resolve()

  })
}

export function fetchStateSession(context, authorized) {

  return new Promise(async (resolve, reject) => {

    let query = combineQuery('res');

    const {document, variables} = query

    try {

      let res = await this.apollo.defaultClient.query({query: document})

      const results = {}

      for (let key in res.data) {
        let [module, name] = key.split('__')
        const result = res.data[key]

        if (!results[module])
          results[module] = {}

        results[module][name] = result
      }

      for (let module in results) {
        await context.dispatch(module + '/stateInit', results[module]);
      }


    } catch (e) {
      console.log(e)
      reject(e)
      return
    }

    if (this.ssrContext) {

      console.log('SERVER ONLY')

      /*
      try {

        const res = await this.$api.get('/main/session/state')

        let resCookies = setCookieParser.parse(res);

        for (var i = 0; i < resCookies.length; i++) {

          let item = resCookies[i];

          this.$q.cookies.set(item.name, item.value, { path: '/',   expires: item.maxAge })
        }

      } catch (e) {
        console.log(e)
      }

       */

    }

    resolve()

  })
}

function createScopesFetchPromise(self, context, scopes, refetch) {
  return new Promise(async (resolve, reject) => {

    const promises = scopes
      .filter(scope => {
        return refetch || !context.getters['scopeFetched'](scope)
      })
      .map(scope => {

        let query = combineQuery('res');

        query = app.scopeQuery(query, scope)

        return query.document ? query : null;
      })
      .filter(query => !!query)
      .map(query => {

        return new Promise(async (resolve, reject) => {

          const {document, variables} = query

          try {
            let res = await self.apollo.defaultClient.query({
              query: document,
              fetchPolicy: 'no-cache',
            })
            resolve(res.data);
          } catch (e) {
            console.log(e)
          }

        })
      })

    if (promises.length) {

      const results = await Promise.all(promises)

      const resultsByModule = {};

      scopes.forEach((scope, index) => {

        const scopeResult = results[index]

        if (scopeResult) {

          for (let key in scopeResult) {

            let [module, opType, opName, varName] = key.split('__')

            if (!opName) {
              varName = opType
              opType = 'commit'
              opName = 'SCOPE_' + scope.toUpperCase()
            } else if (!varName) {
              varName = opType
              opType = 'commit'
            }

            const result = scopeResult[key]

            if (!resultsByModule[module])
              resultsByModule[module] = {}

            if (!resultsByModule[module][opType])
              resultsByModule[module][opType] = {}

            if (!resultsByModule[module][opType][opName])
              resultsByModule[module][opType][opName] = {}

            resultsByModule[module][opType][opName][varName] = result
          }
        }
      })

      for (let module in resultsByModule) {
        for (let opType in resultsByModule[module]) {
          for (let opName in resultsByModule[module][opType]) {
            await context[opType](module + '/' + opName, resultsByModule[module][opType][opName]);
          }
        }
      }

      scopes.forEach((scope, index) => {
        context.dispatch('scopeSetFetched', scope)
      })

    }

    resolve();
  })
}

export function scopesFetch(context, scopes) {
  return createScopesFetchPromise(this, context, scopes, false);
}

export function scopesRefetch(context, scopes) {
  return createScopesFetchPromise(this, context, scopes, true);
}

export function scopeLoad(context, scope) {
  return new Promise(async (resolve, reject) => {

    const promises = scopes.filter(scope => {
      return refetch || !context.getters['scopeFetched'](scope)
    }).map(scope => {
      let query = combineQuery('res');

      query = app.scopeQuery(query, scope)

      return query;

    }).map(query => {

      return new Promise(async (resolve, reject) => {

        const {document, variables} = query

        try {
          let res = await self.apollo.defaultClient.query({
            query: document,
            fetchPolicy: 'no-cache',
          })
          resolve(res.data);
        } catch (e) {
          reject(e)
          console.log(e)
        }

      })
    })

    resolve(await Promise.all(promises));
  })
}

export function scopeSetFetched(context, scope) {
  context.commit('SCOPE_SET_FETCHED', scope)
}
