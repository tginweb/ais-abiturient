export default function () {
    return {

        sess: {
            favs: [],
            basket: {
                data: {
                    PRICE: 0,
                    ITEMS: [],
                    WEIGHT: 0,
                    COUNT: 0,
                    QUANTITY: 0,
                    MIN_PRICE: 0,
                    MIN_PRICE_REACHED: false,
                },
                op: null,
                opInitiator: null,
                fetching: false,
                withVorder: false,
                queue: {
                    activeRequests: 0,
                    requestId: 0,
                    actions: []
                },
            },
            vorder: {
                data: {
                    FORM: {
                        PROPS: [],
                        FIELDS: {
                            DELIVERY_ID: null
                        },
                        PAYSYSTEMS: [],
                        DELIVERIES: [],
                        DELIVERY_CALCULATED: false,
                        DELIVERY_FREE_FROM_PRICE: 0,
                        BONUSES_AVAILABLE: 0,
                        BONUSES: 0,
                        COUPONS: [],
                        COUPON_CAN_ADD: false,
                    },
                    ORDER: {
                        PRICE: 0,
                        PRICE_BASKET: 0,
                        PRICE_BASKET_BASE: 0,
                        PRICE_DISCOUNT: 0,
                        PRICE_DELIVERY: 0,
                        PRICE_TOTAL: 0,
                        PRICE_PAY: 0,
                        BASKET: [],
                    },
                },
                op: null,
                fetching: false,
            },
        },

        user: {
            BONUS: {
                VALUE: null,
                FETCHED: false,
                FETCHED_TIME: null,
            },
            CLIENT_CARD: {
                ID: null,
                LEVEL_NAME: null,
                LEVEL_CODE: null,
            },
            ORDERS_COUNT: false
        },

        request: {
            userBonus: {
                fetching: false
            }
        },

        dashboard: {},

        dialog: {
            order: {value: false},
            order_profile_edit: {value: false},
            order_profiles: {value: false},
            order_cancel: {value: false},
            order_repeat: {value: false},
            basket_clear: {value: false},
            address_map: {value: false},
        },

    }
}
