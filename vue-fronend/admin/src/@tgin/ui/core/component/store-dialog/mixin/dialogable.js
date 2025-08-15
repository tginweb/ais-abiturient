export default {
    props: {
        visible: {},
    },
    data() {
        return {
            visibleData: this.visible,
        }
    },
    computed: {},

    watch: {
        visible(val) {
            this.visibleData = val
        },
        visibleData(val) {
            this.$emit('update:visible', val)
            if (!val) this.onDialogClose();
        }
    },
    methods: {
        onDialogClose() {

            this.$nextTick(() => {
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                }, 50)
            })
        }
    },
}

