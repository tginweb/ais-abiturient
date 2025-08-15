<template>

    <div class="com">

        <q-form ref="form">

            <q-input :loading="sending"
                     :placeholder="placeholder"
                     :rules="[
                        v => !!v || 'Необходимо заполнить телефон',
                        v => util.checkPhone(v.replace(/\D/g,'')) || 'Wrong format',
                     ]"
                     @keydown.enter="onSubmit"
                     class="bg-white"
                     outlined
                     ref="input"
                     solo
                     mask="+7 (###) ###-####"
                     fill-mask
                     v-model="input.text"
                     lazy-rules
            ></q-input>

        </q-form>

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


                this.$refs.form.validate().then(success => {

                    console.log(success);

                    if (success) {
                        this.$emit('submit', this.input)
                    }
                    else {
                        this.$emit('submitWrong', this.input)
                    }

                }).catch((e)=>{
                    console.log(e);
                })


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
