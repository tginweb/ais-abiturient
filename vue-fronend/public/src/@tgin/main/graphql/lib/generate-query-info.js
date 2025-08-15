import {deepGet, deepSet} from '@tgin/main/common/lib/util/base';

export default function generateQueryInfo(name, gql, info = {}, options = {}) {

    //leaktest
    delete info.pollInterval

    options = {
        varPath: 'queries.' + name + '.vars',
        resPath: 'queries.' + name + '.result',
        statePath: 'queries.' + name + '.state',
        update: true,
        updateCache: false,
        haveMore: false,
        ...options
    }

    const state = deepGet(this, options.statePath);

    const res = {
        query: gql,
        deep: true,
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
        variables() {

            const vars = {
                ...deepGet(this, options.varPath),
                queryId: this.$options.name + '.' + name,
            };

            if (vars.await) vars.await = this.$options.name + '.' + vars.await

            return vars
        },
        skip() {
            let state
            state = deepGet(this, options.statePath)

            return state && state.hasOwnProperty('skip') ? state.skip : false
        },
        error (error) {
            let state

            this.$bus.emit('processMessages', this.$util.graphql.exceptionToMessages(error))

            if (state = deepGet(this, options.statePath)) {
                state.error = true
                deepSet(this, options.statePath, state)
            }
        },
        watchLoading(isLoading, countModifier) {

            let state
            if (state = deepGet(this, options.statePath)) {
                state.isLoading = isLoading
                deepSet(this, options.statePath, state)
            }
        },
        notifyOnNetworkStatusChange: true,
        loadingKey: 'queriesLoading',
        ...info
    }

    if (options.update) {
        if (typeof options.update === 'boolean') {
            res.update = function(data) {

                let state

                if (state = deepGet(this, options.statePath)) {
                    if (state && state.mode === 'more') return
                }

                if (options.updateCache) {
                   // const vars = deepGet(this, options.varPath)
                   // this.cacheFragmentQuery(gql, vars, data.res)
                }

                deepSet(this, options.resPath, data.res)

                return data.res
            }
        } else {
            res.update = options.update
        }
    }


    return res
}
