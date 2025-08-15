<template>

    <div>

    </div>

</template>

<script>

    import {classToString, styleToString} from "@tgin/main/common/lib/util/html";

    export default {
        components: {},
        props: {
            rowClass: {},
            rowStyle: {},

            item: {
                default: () => ({})
            },

            itemRowClass: {},
            itemClass: {},
            itemContentClass: {},
            itemStyle: {},
            itemIs: {
                default: 'query-item'
            },
            itemProps: {},
            itemElements: {
                default: () => ({})
            },
            query: {},
            queryId: {},
            items: {},
            queryState: {}
        },
        data() {
            return {}
        },
        methods: {

            getItemComponent(item, index) {
                return item.is || this.item && this.item.is || this.itemIs
            },

            bindItem(item, index) {

                let res = this.item || {}

                res = {
                    class: this.itemClass,
                    style: this.itemStyle,
                    elements: this.itemElements,
                    queryId: this.queryId,
                    ...res,
                }

                if (this.itemContentClass) {
                    res.elements.content = res.elements.content || {}
                    res.elements.content.class = this.itemContentClass
                }

                if (this.itemRowClass) {
                    res.elements.row = res.elements.row || {}
                    res.elements.row.class = this.itemRowClass
                }

                if (this.queryState && this.queryState.mode === 'more') {
                    res.moreMode = true
                }

                res.item = item
                res.key = item._id || index
                res.index = index + 1

                res.is = this.getItemComponent(item, index)

                return res
            },
        },

        computed: {

            bindRow() {

                let res = {
                    class: classToString(this.rowClass),
                    style: styleToString(this.rowStyle),
                }

                return res
            }
        }
    }
</script>

<style lang="scss" scoped>


</style>
