const debounce = require('lodash/debounce')

let requestIdGlobal = 0

export async function queueRunProcess(context) {

    const queue = context.state.sess.basket.queue.actions

    if (queue.length) {

        const requestId = requestIdGlobal++

        context.commit('BASKET_FETCH_STATUS', true)
        context.commit('BASKET_QUEUE_SEND_START', requestId)

        const query = require('@tgin/sale/pub/gql/basket/mutation/actions.gql')

        try {

            const basket = await context.dispatch('gql/mutation', {
                mutation: query,
                variables: {
                    actions: queue,
                    vorderInclude: context.state.sess.basket.withVorder
                }
            }, {root: true})

            if (context.state.sess.basket.queue.requestId === requestId) {

                context.commit('BASKET_UPDATE', {
                    ...basket
                })

                if (context.state.sess.basket.withVorder && basket.VORDER) {
                    context.commit('VORDER_UPDATE', {
                        ...basket.VORDER
                    })
                }

                /*
                queue.forEach((item) => {

                    const message = {}

                    switch (item.op) {
                        case 'add':
                            message.message = ' корзину'
                            break
                        case 'quantity-set':
                            message.message = 'Товар добавлен в корзину'
                            break
                    }
                })

                Notify.create({
                    message: 'Товар добавлен в корзину',
                    color: 'positive',
                    position: 'bottom-right',
                    timeout: 800,
                    classes: 's-font-md'
                })

                 */

                this.$bus.emit('basket.changed')
            }

        } catch (e) {
            console.log('--')
            console.log(JSON.parse(JSON.stringify(e)))

        }

        context.commit('BASKET_QUEUE_SEND_END')

        context.commit('BASKET_FETCH_STATUS', false)
    }
}

let queueRunProcessDebounced

export async function basketQueueRun(context, {debounced}) {

    if (!queueRunProcessDebounced)
        queueRunProcessDebounced = debounce(queueRunProcess.bind(this), 1200)

    if (debounced) {
        queueRunProcessDebounced(context)
    } else {
        await queueRunProcess.bind(this)(context)
    }
}

export async function basketQueueAdd(context, {action, debounced}) {
    context.commit('BASKET_QUEUE_ADD', action)
    context.dispatch('basketQueueRun', {debounced})
}

export async function basketOp(context, [op, params = {}, options = {}]) {

    let debounced = true

    switch (op) {
        case 'add':
            debounced = false
            break
        case 'quantity-set':
            context.commit('BASKET_QUANTITY_SET', params);
            break
        case 'quantity-add':
            context.commit('BASKET_QUANTITY_ADD', params);
            break
        case 'remove':
            context.commit('BASKET_REMOVE', params);
            break
        case 'clear':
            context.commit('BASKET_CLEAR', params);
            break
        case 'comment':
            context.commit('BASKET_COMMENT', params);
            break
    }

    await context.dispatch('basketQueueAdd', {
        action: {
            op: op,
            ...params,
            state: context.state.sess.basket.data.ITEMS
        },
        debounced
    })
}

export async function basketFetch(context, {params = {}, state = {}}) {

    let query, vars = {};

    vars = {
        ...params,
        vorderInclude: context.state.sess.basket.withVorder,
    }

    query = require('@tgin/sale/pub/gql/basket/query/state.gql')

    context.commit('BASKET_FETCH_STATUS', true)

    try {

        const basket = await context.dispatch('gql/fetch', {
            query: query,
            variables: vars,
            state: state
        }, {root: true})

        context.commit('BASKET_UPDATE', basket)

        if (context.state.sess.basket.withVorder && basket.VORDER) {
            context.commit('VORDER_UPDATE', {
                ...basket.VORDER
            })
        }

    } catch (e) {
        console.log(e)
    }

    context.commit('BASKET_FETCH_STATUS', false)
}

export async function favOp(context, params) {

    try {
        switch (params.action) {
            case 'add': {
                const item = await context.dispatch('gql/mutation', {
                    mutation: require('@tgin/sale/pub/gql/fav/mutation/add.gql'),
                    variables: params
                }, {root: true})
                context.commit('FAV_ADD', item)
                this.$bus.emit('fav.changed', params)
                return item
            }
            case 'remove': {
                const res = await context.dispatch('gql/mutation', {
                    mutation: require('@tgin/sale/pub/gql/fav/mutation/action.gql'),
                    variables: params
                }, {root: true})

                context.commit('FAV_REMOVE', params)
                this.$bus.emit('fav.changed', params)
                return res
            }
            case 'clear': {
                const res = await context.dispatch('gql/mutation', {
                    mutation: require('@tgin/sale/pub/gql/fav/mutation/action.gql'),
                    variables: params
                }, {root: true})
                context.commit('FAV_CLEAR')
                this.$bus.emit('fav.changed', params)
                return res
            }
        }
    } catch (e) {

    }
}

export function vorderFetch(context, vars = {}) {
    return new Promise(async (resolve, reject) => {

        context.commit('VORDER_OP_START', {op: fetch})
        try {
            const {data} = await this.apollo.defaultClient.query(
                {
                    query: require('@tgin/sale/pub/gql/vorder/query/vorder.gql'),
                    fetchPolicy: 'no-cache',
                    variables: {
                        ...vars,
                    }
                }
            )
            context.commit('VORDER_UPDATE', data.res)
            resolve(data.res);
        } catch (e) {
            console.log(e)
            reject(e)
        }
        context.commit('VORDER_OP_END')
    })
}

export function vorderOp(context, {op, params, order}) {
    return new Promise(async (resolve, reject) => {
        try {

            context.commit('VORDER_OP_START', {op, params, order})

            const res = await context.dispatch('gql/mutation', {
                mutation: require('@tgin/sale/pub/gql/vorder/mutation/vorder_op.gql'),
                variables: {
                    op: op,
                    params: params,
                    order: order
                },
                returnResult: false,
                throwUserError: false,
            }, {root: true})

            const vorder = res.result

            if (vorder)
                context.commit('VORDER_UPDATE', vorder)

            context.commit('VORDER_OP_END')

            resolve({
                state: res.state,
                payload: res.payload,
                vorder: vorder,
            });

        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}


export function fetchUserBuyerCompanies(context) {
    return new Promise(async (resolve, reject) => {
        try {
            let {data} = await this.apollo.defaultClient.query({
                query: require('@tgin/sale/pub/gql/buyer/query/company_list.gql'),
                fetchPolicy: 'no-cache',
            })
            context.commit('SET_USER_BUYER_COMPANIES', data.res)
            resolve();
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

export async function deleteUserBuyerCompany(context, {id}) {
    return await context.dispatch('gql/mutation', {
        mutation: require('@tgin/sale/pub/gql/buyer/mutation/company_delete.gql'),
        variables: {
            id: id
        },
        confirm: {
            title: 'Удаление',
            message: 'Вы действительно хотите удалить профиль компании?',
        }
    }, {root: true})
}

export function fetchUserOrderProfiles(context) {
    return new Promise(async (resolve, reject) => {
        try {
            let {data} = await this.apollo.defaultClient.query({
                query: require('@tgin/sale/pub/gql/profile/query/list.gql'),
                fetchPolicy: 'no-cache',
            })
            context.commit('SET_USER_ORDER_PROFILES', data.res)
            resolve();
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

export async function fetchPaycards(context) {

    try {
        const {data: {res}} = await this.apollo.defaultClient.query({
            query: require('@tgin/sale/pub/gql/paycard/query/list.gql'),
            fetchPolicy: 'no-cache',
        })

        context.commit('SET_USER_PAYMENT_CARDS', res)

        return res
    } catch (e) {
        console.log(e)
    }
}

export function orderProfileFetch(context, {id, hash, options = {}}) {
    return context.dispatch('gql/fetch', {
        query: require('@tgin/sale/pub/gql/profile/query/single.gql'),
        variables: {
            id: id
        },
        ...options
    }, {root: true})
}

export async function userOrderProfileSetDefault(context, id) {
    try {
        await context.dispatch('gql/mutation', {
            mutation: require('@tgin/sale/pub/gql/profile/mutation/profile_default.gql'),
            variables: {
                id: id
            }
        }, {root: true})
        context.commit('user/PROP', {code: 'ORDER_PROFILE_ID', value: id}, {root: true})
        return true
    } catch (e) {
        console.log(e.message)
        console.log(JSON.parse(JSON.stringify(e)))
        return false
    }
}

export async function userOrderCompanySetDefault(context, id) {
    try {
        await context.dispatch('gql/mutation', {
            mutation: require('@tgin/sale/pub/gql/buyer/mutation/company_default.gql'),
            variables: {
                id: id
            }
        }, {root: true})
        context.commit('user/PROP', {code: 'ORDER_COMPANY_ID', value: id}, {root: true})
        return true
    } catch (e) {
        console.log(e.message)
        console.log(JSON.parse(JSON.stringify(e)))
        return false
    }
}

export function userOrderFetch(context, {id, hash, options = {}}) {
    return context.dispatch('gql/fetch', {
        query: require('@tgin/sale/pub/gql/order/query/single.gql'),
        variables: {
            id: id,
            hash: hash
        },
        ...options
    }, {root: true})
}

export function userBuyerCompanyFetch(context, {id, hash, options = {}}) {

    return context.dispatch('gql/fetch', {
        query: require('@tgin/sale/pub/gql/buyer/query/company_single.gql'),
        variables: {
            filter: {ID: {eq: id}}
        },
        fetchPolicy: 'no-cache',
        ...options
    }, {root: true})
}

export async function userBonusesEnsure(context, refetch) {

    const bonusState = context.state.user.bonuses

    if (!refetch) {
        if (bonusState.fetched) {
            const diffMinutes = (Date.now() - bonusState.fetchedTime) / (1000 * 60);
            if (diffMinutes > 5) {
                refetch = true
            }
        } else {
            refetch = true
        }
    }

    if (refetch) {
        context.commit('BONUSES', {
            fetching: true,
            fetching: true,
        })

        try {
            const data = await context.dispatch('gql/fetch', {
                query: require('../gql/common/query/bonses.gql'),
                fetchPolicy: 'no-cache',
            }, {root: true})

            console.log(data)

            context.commit('BONUSES', {
                fetchedTime: Date.now(),
                fetching: false,
                fetched: true,
                value: data.VALUE
            })

        } catch (e) {
            context.commit('BONUSES', {
                fetching: false,
            })
        }
    }

    return bonusState.value
}


