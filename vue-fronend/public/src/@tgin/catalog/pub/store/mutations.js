import Vue from 'vue';

export function SCOPE_SESS(state, data) {
    if (data.favItems) {
        state.sess.favItems = data.favItems
    }
}

export function FAV_ITEM_ADD(state, productId) {
    state.sess.favItems.push(productId)
}

export function FAV_ITEM_REMOVE(state, productId) {
    state.sess.favItems = state.sess.favItems.filter(id => id !== productId)
}

export function FAV_ITEM_CLEAR(state) {
    state.sess.favItems = []
}

export function FAV_ITEMS_UPDATE(state, data) {
    Vue.set(state.sess, 'favItems', data)
}
