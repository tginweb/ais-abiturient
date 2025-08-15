import Vue from "vue"


function prepareBasket(data) {
    return data
}

function findOrderItem(items, data) {

    return items.find(item => {
            if (data.itemId) {
                return data.itemId === item.ID
            } else if (data.productHash) {
                return data.productHash === item.HASH
            } else if (data.productId) {
                return data.productId === item.PRODUCT_ID
            }
        }
    )
}

export function BASKET_OP_START(state, [op, data]) {
    state.sess.basket.op = op
}

export function BASKET_FETCH_STATUS(state, data) {
    state.sess.basket.fetching = data
}

export function BASKET_UPDATE(state, data) {
    state.sess.basket.opInitiator = data.initiatorId
    Object.assign(state.sess.basket.data, prepareBasket(data))
}

export function BASKET_ADD(state, data) {

}

export function BASKET_QUANTITY_SET(state, data) {
    const orderItem = findOrderItem(state.sess.basket.data.ITEMS, data)
    if (orderItem) {
        Vue.set(orderItem, 'QUANTITY', data.quantity)
    }
}

export function BASKET_QUANTITY_ADD(state, data) {
    const orderItem = findOrderItem(state.sess.basket.data.ITEMS, data)
    if (orderItem)
        orderItem.QUANTITY = item.QUANTITY + data.quantity
}

export function BASKET_REMOVE(state, data) {
    const orderItem = findOrderItem(state.sess.basket.data.ITEMS, data)
    if (orderItem)
        state.sess.basket.data.ITEMS = state.sess.basket.data.ITEMS.filter(item => item.ID !== orderItem.ID)
}

export function BASKET_COMMENT(state, data) {
    const orderItem = findOrderItem(state.sess.basket.data.ITEMS, data)
    if (orderItem) {
        orderItem.COMMENT = data.comment
    }
}

export function BASKET_CLEAR(state, data) {
    if (state.sess.basket.data)
        state.sess.basket.data.ITEMS = []
}

export function BASKET_QUEUE_ADD(state, action) {

    if (action.op === 'clear') {
        state.sess.basket.queue.actions = []
    } else {
        state.sess.basket.queue.actions = state.sess.basket.queue.actions.filter(
            item => !(
                action.itemId && (item.itemId === action.itemId) ||
                action.productId && (item.productId === action.productId)
            )
        )
    }

    state.sess.basket.queue.actions.push(action)
}

export function BASKET_QUEUE_CLEAR(state, action) {
    state.sess.basket.queue.actions = []
}


export function BASKET_QUEUE_SEND_START(state, requestId) {
    state.sess.basket.queue.requestId = requestId
    state.sess.basket.queue.activeRequests++
    state.sess.basket.queue.actions = []
}

export function BASKET_QUEUE_SEND_END(state, requestId) {
    state.sess.basket.queue.activeRequests--
}

export function BASKET_WITH_VORDER(state, mode) {
    state.sess.basket.withVorder = mode
}


export function SCOPE_SESS(state, data) {

    if (data.personTypes)
        state.sess.personTypes = data.personTypes

    if (data.basket)
        Object.assign(state.sess.basket.data, prepareBasket(data.basket))

    if (data.favs)
        Vue.set(state.sess, 'favs', data.favs)

    if (data.vorder)
        Object.assign(state.sess.vorder.data, data.vorder)
}

export function FAV_ADD(state, item) {
    state.sess.favs.push(item)
}

export function FAV_REMOVE(state, data) {
    if (data.itemId) {
        state.sess.favs = state.sess.favs.filter(item => item.ID !== data.itemId)
    } else if (data.productId) {
        state.sess.favs = state.sess.favs.filter(item => item.PRODUCT_ID !== data.productId)
    }
}

export function VORDER_UPDATE(state, data) {
    Object.assign(state.sess.vorder.data, data)
}

export function VORDER_OP_START(state, {op, params, order}) {
    state.sess.vorder.op = op
    state.sess.vorder.fetching = true
}

export function VORDER_OP_END(state, data) {
    state.sess.vorder.fetching = false
}


export function SCOPE_USER(state, data) {

    if (data.userInfo) {
        Object.assign(state.user, data.userInfo)
    }

    if (data.userOrdersActive) {
        Object.assign(state.user, {
            ordersActive: data.userOrdersActive,
        })
    }

    if (data.userBuyerCompanies) {
        Object.assign(state.user, {
            buyerCompanies: data.userBuyerCompanies,
        })
    }

    if (data.userOrderProfiles) {
        Object.assign(state.user, {
            orderProfiles: data.userOrderProfiles,
        })
    }

    if (data.userPaymentCards) {
        Object.assign(state.user, {
            paymentCards: data.userPaymentCards,
        })
    }

}

export function SCOPE_ORDER(state, data) {

}

export function SET_USER_ORDER_PROFILES(state, data) {
    state.user.orderProfiles = data
}

export function SET_USER_BUYER_COMPANIES(state, data) {
    state.user.buyerCompanies = data
}

export function SET_USER_PAYMENT_CARDS(state, data) {
    state.user.paymentCards = data
}


export function BONUSES(state, data) {
    Object.assign(state.user.bonuses, data)
}
