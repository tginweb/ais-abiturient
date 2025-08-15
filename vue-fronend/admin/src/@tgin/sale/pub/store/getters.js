import {Screen} from 'quasar'

export function personTypes(state, getters, rootState) {
    return state.sess.personTypes
}

export function personTypesById(state, getters, rootState) {
    return state.sess.personTypes.reduce((map, item) => {
        map[item.ID] = item
        return map
    }, {})
}

export function personTypesUnrestricted(state, getters, rootState) {
    return state.sess.personTypes.filter(item => !item.RESTRICTED || true)
}

export function basket(state, getters, rootState) {
    return state.sess.basket;
}

export function basketData(state, getters, rootState) {
    return state.sess.basket.data;
}

export function basketItems(state, getters, rootState) {
    return getters.basketData.ITEMS.map(item => {
        const price = item.PRICE
        const priceBase = item.PRICE_BASE
        return {
            ...item,
            PRICE: price,
            PRICE_BASE: priceBase,
            FINAL_PRICE_BASE_COMP: Math.round(priceBase * item.QUANTITY),
            FINAL_PRICE_COMP: Math.round(price * item.QUANTITY),
            PROP: item.PROPS.reduce((map, prop) => {
                map[prop.CODE] = prop
                return map
            }, {}),
            PROP_VAL: item.PROPS.reduce((map, prop) => {
                map[prop.CODE] = prop.VALUE
                return map
            }, {})
        }
    })
}

export function basketCount(state, getters, rootState) {
    return getters.basketData.ITEMS.length;
}

export function basketQuantity(state, getters, rootState) {
    return getters.basketData.QUANTITY;
}

export function basketPrice(state, getters, rootState) {
    return Math.round(getters.basketItems.reduce((price, item) => {
        price = price + item.FINAL_PRICE_COMP
        return price
    }, 0))
}

export function basketPriceFormatted(state, getters, rootState) {
    return getters.basketPrice + ' ₽';
}

export function basketItemsByProductId(state, getters, rootState) {
    return getters.basketItems.reduce((map, item) => {
        if (!map[item.PRODUCT_ID]) {
            map[item.PRODUCT_ID] = []
        }
        map[item.PRODUCT_ID].push(item)
        return map
    }, {});
}

export function basketActionsQueued(state, getters, rootState) {
    return state.sess.basket.queue.actions.length > 0;
}

export function basketBusy(state, getters, rootState) {
    return state.sess.basket.fetching || state.sess.vorder.fetching || getters['basketActionsQueued']
}

export function basketMinPriceReached(state, getters, rootState) {
    return getters.basketData.MIN_PRICE_REACHED;
}

export function basketMinPrice(state, getters, rootState) {
    return getters.basketData.MIN_PRICE;
}

export function favs(state, getters, rootState) {
    return state.sess.favs.map(item => {
        return {
            ...item,
        }
    })
}

export function favsByProductId(state, getters, rootState) {
    return getters.favs.reduce((map, item) => {
        if (!map[item.PRODUCT_ID]) {
            map[item.PRODUCT_ID] = []
        }
        map[item.PRODUCT_ID].push(item)
        return map
    }, {});
}


export function vorderData(state, getters, rootState) {
    return state.sess.vorder.data;
}

export function vorderOrder(state, getters, rootState) {
    return getters.vorderData.ORDER
}

export function vorderForm(state, getters, rootState) {
    const order = getters.vorderData.ORDER

    let freeProgress = order.PRICE_BASKET && order.DELIVERY_FREE_FROM_PRICE ? order.PRICE_BASKET / order.DELIVERY_FREE_FROM_PRICE : 0

    freeProgress = freeProgress > 1 ? 1 : freeProgress

    return {
        ...getters.vorderData.FORM,

        PROPS_BYCODE: getters.vorderData.FORM.PROPS.reduce((map, item) => (map[item.CODE] = item, map), {}),

        DELIVERY_FREE_PROGRESS: freeProgress,
        DELIVERY_FREE_DELTA: getters.vorderData.FORM.DELIVERY_FREE_FROM_PRICE - order.PRICE_BASKET,

        DELIVERY: getters.vorderData.FORM.DELIVERIES.find(item => getters.vorderData.FORM.FIELDS.DELIVERY_ID === item.ID),
        PAYSYSTEM: getters.vorderData.FORM.PAYSYSTEMS.find(item => getters.vorderData.FORM.FIELDS.PAY_SYSTEM_ID === item.ID),

        PERSON_TYPE: getters.vorderData.FORM.PERSON_TYPES.find(item => getters.vorderData.FORM.FIELDS.PERSON_TYPE_ID === item.ID),

        PROFILE: getters.vorderData.FORM.PROFILES.find(item => getters.vorderData.FORM.PROFILE_ID === item.ID),
        COMPANY: getters.vorderData.FORM.COMPANIES.find(item => getters.vorderData.FORM.COMPANY_ID === item.ID),
    }
}

export function userOrderProfileId(state, getters, rootState, rootGetters) {
    return parseInt(rootGetters['user/propVal']['ORDER_PROFILE_ID'])
}

export function userDefaultCompanyId(state, getters, rootState, rootGetters) {
    return parseInt(rootGetters['user/propVal']['ORDER_COMPANY_ID'])
}

export function userOrderProfiles(state, getters, rootState) {
    return state.user.orderProfiles
}

export function userOrderProfilesByPersonType(state, getters, rootState) {
    return state.user.orderProfiles.reduce((map, item) => {

        if (!map[item.PERSON_TYPE_ID])
            map[item.PERSON_TYPE_ID] = []

        map[item.PERSON_TYPE_ID].push(item)

        return map
    }, {});
}

export function userAllowJuridicalPersonType(state, getters, rootState) {
    return getters.userBuyerCompanies.length > 0
}

export function userBuyerCompanies(state, getters, rootState) {
    return state.user.buyerCompanies
}

export function userPaymentCardsExists(state, getters, rootState) {
    return !!state.user.paymentCards.length
}

export function userPaymentCards(state, getters, rootState) {
    return state.user.paymentCards
}

export function userPaymentCardsBySid(state, getters, rootState) {
    return state.user.paymentCards.reduce((map, item) => {
        map[item.VALUE] = item
        return map
    }, {});
}

export function userPaymentCardsByKey(state, getters, rootState) {
    return state.user.paymentCards.reduce((map, item) => {
        map[item.ID] = item
        return map
    }, {});
}

export function userPaymentCardDefault(state, getters, rootState) {
    return state.user.paymentCards.find(item => item.DEFAULT)
}

export function userOrdersActive(state, getters, rootState) {
    return state.user.ordersActive
}


export function userBonuses(state, getters, rootState) {
    return state.user.bonuses
}

export function userBonusesLevelName(state, getters, rootState) {
    return state.user.bonusesLevelName
}


export function widgetPersonalActiveOrders(state, getters, rootState) {
    return {
        id: 'sale:personal.orders.active',
        groups: ['personal'],
        title: 'Активные заказы',
        headerMoreLink: {
            label: 'все заказы',
            to: '/personal/orders',
        },
        colClass: 'col-24 col-xl-12',
        mediaIcon1: 'star',
        mediaSize: '30px',
        mediaIconClass: 's-font-xl',
        order: Screen.lt.md ? 0 : null,
        style: {
            //   backgroundColor: '#f4faff !important'
        },
        is: () => import('../component/widget/personal/widget-orders-active')
    }
}

export function widgetPersonalBonus(state, getters, rootState) {
    return {
        id: 'user:personal.bonus',
        groups: ['personal'],
        title: 'Бонусы',
        colClass: 'col-24 col-md-12 col-xl-6',
        theme1: 'card',
        bottomText: getters.userBonusesLevelName,
        mediaText: getters.userBonuses,
        link: '/personal/bonus'
    }
}

export function widgetPersonalOrders(state, getters, rootState) {
    return {
        id: 'user:personal.orders',
        groups: ['personal'],
        title: 'Заказы',
        colClass: 'col-24 col-md-12 col-xl-6',
        theme1: 'card',
        mediaText: 10,
        link: '/personal/order'
    }
}

export function widgetPersonalNotices(state, getters, rootState) {
    return {
        id: 'user:personal.orders2',
        groups: ['personal'],
        title: 'Уведомления',
        headerMoreLink: {
            label: 'все',
            to: '/personal/orders',
        },
        colClass: 'col-24 col-xl-12',
        order: Screen.lt.md ? 0 : null,
        theme1: 'card',
        mediaText1: 10,
        link: '/sss',
        slots: {
            content: () => import('../component/widget/personal/content-notice')
        }
    }
}

export function widgetPersonalAddress(state, getters, rootState) {
    return {
        id: 'user:personal.profiles',
        groups: ['personal'],
        title: 'Адрес доставки',
        headerMoreLink: {
            label: 'все адреса',
            to: '/personal/order-profiles',
        },
        theme1: 'card',
        colClass: 'col-24 col-md-12',
        link: '/personal/order-profiles',
        slots: {
            content: () => import('../component/widget/personal/content-address')
        }
    }
}

export function widgetPersonalCards(state, getters, rootState) {
    return {
        id: 'user:personal.cards',
        groups: ['personal'],
        title: 'Карта оплаты',
        headerMoreLink: {
            label: 'ваши карты',
            to: '/personal/payment-cards',
        },
        theme1: 'card',
        colClass: 'col-24 col-md-12',
        link: '/personal/payment-cards',
        slots: {
            content: () => import('../component/widget/personal/content-cards')
        }
    }
}

export function widgetPersonalFavs(state, getters, rootState) {
    return {
        id: 'user:personal.cards',
        groups: ['personal'],
        title: 'Избранные товары',
        headerMoreLink: {
            label: 'все избранное',
            to: '/personal/favorites',
        },
        theme1: 'card',
        colClass: 'col-24 col-md-24',
        link: '/personal/favorites',
        slots: {
            content: () => import('../component/widget/personal/content-fav')
        }
    }
}

export function widgetsDefault(state, getters, rootState) {
    return [
        getters.widgetPersonalActiveOrders,
        getters.widgetPersonalBonus,
        getters.widgetPersonalOrders,
        getters.widgetPersonalNotices,
        getters.widgetPersonalAddress,
        getters.widgetPersonalCards,
        getters.widgetPersonalFavs,
    ]
}

