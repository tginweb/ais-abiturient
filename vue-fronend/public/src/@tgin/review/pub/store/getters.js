export function widgetPersonalReviews(state, getters, rootState) {
    return  {
        id: 'review:personal.reviews',
        groups: ['personal'],
        title: 'Отзывы',
        headerMoreLink: {
            label: 'все отзывы',
            to: '/personal/payment-cards',
        },
        theme1: 'card',
        colClass: 'col-24 col-md-12',
        link: '/personal/reviews',
        slots: {
            content: () => import('../component/widget/personal/content-reviews')
        }
    }
}
