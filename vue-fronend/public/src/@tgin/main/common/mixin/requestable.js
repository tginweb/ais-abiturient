export default {
    data() {
        return {}
    },

    created() {


    },

    beforeDestroy() {

    },

    methods: {
        requestStatusIcon(status) {
            switch (status) {
                case 'error':
                    return this.$icons.fasExclamationCircle
                case 'success':
                    return this.$icons.farCheckCircle
            }
        }
    }
}

