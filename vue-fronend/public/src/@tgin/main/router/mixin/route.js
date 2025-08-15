export default {

    data() {
        return {
            pageViewBind: {},
            requestState: {
                process: false,
                mutating: false,
                mutated: false,
                fetching: false,
                fetched: false,
            }
        }
    },
    watch: {

    },

    computed: {

        pageDataRouteId() {
            return this.$route.path
        },

        pageRouteData() {
            return this.pageData
        },

        pageData() {

            const pageData = this.$store.state.router.pageData

            if (pageData.routeId !== this.pageDataRouteId) return {}

            return pageData
        },

        contentChunksValueByCode() {
            return this.spage && this.spage.CONTENT_CHUNKS && this.spage.CONTENT_CHUNKS.reduce((map, item) => {
                map[item.CODE] = item.VALUE
                return map
            }, {}) || {};
        },

        contentChunksByGroup() {
            return this.spage && this.spage.CONTENT_CHUNKS && this.spage.CONTENT_CHUNKS.reduce((map, item) => {

                if (item.GROUP) {
                    if (!map[item.GROUP])
                        map[item.GROUP] = []

                    map[item.GROUP].push({
                        ...item,
                        TEMPLATE: this.$util.html.formatTemplateHtml(item.VALUE)
                    })
                }
                return map
            }, {});
        },

        contentChunkTemplate() {
            return this.spage && this.spage.CONTENT_CHUNKS && this.spage.CONTENT_CHUNKS.reduce((map, item) => {
                map[item.CODE] = this.$util.html.formatTemplateHtml(item.VALUE)
                return map
            }, {});
        },

        dataChunk() {
            return this.spage && this.spage.DATA_CHUNKS && this.spage.DATA_CHUNKS.reduce((map, item) => {
                map[item.CODE] = item.VALUE
                return map
            }, {});
        },
    },

    created() {
        this.pageViewBind = this.$store.getters['app/pageViewBind']()
    }
}
