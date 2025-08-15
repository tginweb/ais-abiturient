export const deepGet = require('lodash/get')

export default {
    props: {
        context: {},
        vroute: {}
    },
    data() {
        return {
            errors: {
                common: {
                    messages: [],
                    level: {},
                    code: {}
                }
            },

            mState: {
                process: false,
                mutating: false,
                mutated: false,
                fetching: false,
                fetched: false,
            }
        }
    },
    created() {

    },
    computed: {
        comId() {
            return Math.random().toString(36).substring(7)
        },
        appBase() {
            return process.env.APP_BASE
        },
    },
    watch: {},
    methods: {


        processRequestErrors(data, key = 'common') {

            return

            const messages = errorsExtract(data)

            const collector = {
                messages: [],
                level: {},
                code: {}
            }

            collector.messages = messages
            messages.forEach((message) => {

                collector.level[message.level] = message
                collector.code[message.code] = message

                return;

                if (!collector.level[message.level]) {
                    collector.level[message.level] = []
                }
                collector.level[message.level].push(message)

                if (message.code) {
                    if (!collector.code[message.code]) {
                        collector.code[message.code] = []
                    }
                    collector.code[message.code].push(message)

                }
            })
            this.$set(this.errors, key, collector)
        }
    },
}


