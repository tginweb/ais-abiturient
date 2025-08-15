export default {
    props: {
        value: {},
        emptyReturn: {default: false},
        emptyReturnValue: {default: null},
        noformatReturn: {default: false},
        required: {default: false},
    },
    data() {
        return {
            valueState: this.propValuePrepare(this.value),
            valueStateExternal: false
        }
    },
    methods: {
        propValuePrepare(v) {
            return v
        }
    },
    computed: {
        valueStateFormatValid() {
            return true
        },
        valueStateIsEmpty() {
            return this.valueState === '' || this.valueState === null || typeof this.valueState === 'undefined'
        },
    },
    watch: {
        value(v) {
            if (v === this.valueState)
                return;

            this.valueStateExternal = true
            this.valueState = this.propValuePrepare(v)
        },
        valueState(v) {

            if (this.valueStateExternal) {
                this.valueStateExternal = false
                return
            }

            if (this.valueStateIsEmpty) {
                (this.emptyReturn !== false) && this.$emit('input', this.emptyReturnValue)
            } else if (this.valueStateFormatValid) {
                this.$emit('input', v)
            } else {
                (this.noformatReturn !== false) && this.$emit('input', v)
            }
        }
    },
}


