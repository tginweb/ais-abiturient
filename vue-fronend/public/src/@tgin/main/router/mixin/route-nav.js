export default {

    data() {
        return {
            instancePageData: {},
            routeFilter: {
                date: this.$route.params.date,
            },
            routePath: this.$route.path,
            routeNav: {
                page: parseInt(this.$route.query.page) || 1,
                sort: this.$route.query.sort,
                asc: !!parseInt(this.$route.query.asc),
            },
            routePage: parseInt(this.$route.query.page) || 1
        }
    },
    watch: {
        $route(route, before) {
            this.routeNav.page = parseInt(route.query.page) || 1
            this.routePage = parseInt(route.query.page) || 1

            this.routeNav.sort = route.query.sort
            this.routeNav.asc = !!parseInt(route.query.asc)
        },
        routeNav: {
            handler: function (data) {
                this.$store.dispatch('router/setQueryNav', data)
            },
            deep: true,
        },
    },

    computed: {
        routePaginated() {
            return this.$route.query.page
        },

        routeBase() {
            return this.$route.path
        },

        routeUrl() {

            const params = []

            const page = Math.max(this.routePage, this.routeNav.page)

            if (page > 1)
                params.push('page=' + page)

            if (this.routeNav.sort) {
                params.push('sort=' + this.routeNav.sort)
                params.push('asc=' + (this.routeNav.asc ? '1' : '0'))
            }

            if (params.length) {
                return this.routeBase + '?' + params.join('&')
            } else {
                return this.routeBase
            }
        },

    }
}
