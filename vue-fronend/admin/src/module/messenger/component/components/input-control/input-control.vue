<template>

    <div class="com">

        <v-text-field v-model="input.value" @keydown.enter="onSubmit" outline></v-text-field>

    </div>

</template>

<script>

    export default {
        components: {},
        props: {
            value: {},
            send: {},
            placeholder: {},
            sending: {}
        },
        data() {
            return {
                input: this.value,
                valid: true
            }
        },
        mounted() {
        },

        beforeDestroy() {
        },

        computed: {
        },

        methods: {

            onSubmit() {
                this.$emit('submit', this.input)
            }
        },

        watch: {
            send(val) {
                if (val) {
                    this.onSubmit();
                }
            },

            value(val) {

                this.input = val;
            }
        },

    }
</script>

<style lang="scss" scoped>

    .com {


    }


</style>
