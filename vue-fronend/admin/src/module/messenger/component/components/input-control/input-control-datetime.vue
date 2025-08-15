<template>

    <div class="com">

        <v-form lazy-validation ref="form" v-model="valid">

            <div class="d-flex">

                <q-select :items="[
                               {value:'сегодня', text: 'сегодня'},
                               {value:'завтра', text: 'завтра'},
                               {value:'послезавтра', text: 'послезавтра'},
                               {value:'13.11.2019', text: '13.11.2019'},
                               {value:'14.11.2019', text: '14.11.2019'},
                               {value:'15.11.2019', text: '15.11.2019'},
                               {value:'16.11.2019', text: '16.11.2019'},
                          ]"
                          :rules="[

                          ]"
                          class="bg-white"
                          outline
                          ref="inputDate"
                          solo
                          v-model="input.date"
                ></q-select>

                <q-input
                        :rules="[
                            v => !!v || 'Не указано время',
                            v => !!$util.date.parseTime(v) || 'Wrong format',
                        ]"
                        :tmask="getMask('time')"
                        class="bg-white"
                        outline
                        ref="inputTime"
                        solo
                        v-model="input.time"
                        validate-on-blur
                >

                </q-input>

            </div>


        </v-form>

    </div>

</template>

<script>

    import InputControl from './input-control';

    export default {
        extends: InputControl,
        components: {},
        data() {
            return {
                input: this.value,
            }
        },

        methods: {

            onSubmit() {

                this.input.text = this.input.date + ' ' + this.input.time

                if (this.$refs.form.validate()) {
                    this.$emit('submit', this.input)
                } else {
                    this.$emit('submitWrong', this.input)
                }
            }
        },

    }

</script>

<style lang="scss" scoped>

    .com {


    }

    .v-input {
        /deep/ {
            input {
                margin-top: 0;
            }
        }
    }

</style>
