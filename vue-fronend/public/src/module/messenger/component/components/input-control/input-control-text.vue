<template>

    <div class="com">

        <q-input
                :loading="sending"
                :placeholder="placeholder"
                @keydown.enter="onSubmit"
                class="bg-white"
                outlined
                solo
                v-model="input.text"
        ></q-input>

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
