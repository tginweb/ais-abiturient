<template>

    <div class="com">


        <v-form v-model="valid" lazy-validation ref="form">

            <q-input
                    :loading="sending"
                    :placeholder="placeholder"
                    @keydown.enter="onSubmit"
                    class="bg-white"
                    outlined
                    solo
                    v-model="input.text"
            ></q-input>


        </v-form>

    </div>

</template>

<script>

    import InputControl from './input-control';

    export default {
        extends: InputControl,
        components: {
        },
        data() {
            return {
                coords: {

                }
            }
        },
        methods: {

            onChangeData(valValue, valData, status) {

                if (valData) {
                    this.coords = [valData.geo_lat, valData.geo_lon]

                } else {
                    this.coords = false
                }
            },

            onSubmit() {

                if (this.coords && this.$refs.form.validate()) {
                    this.$emit('submit', this.input)
                } else {
                    this.$emit('submitWrong', this.input)
                }
            }
        },

        watch: {

        },

    }

</script>

<style lang="scss" scoped>


</style>
