<template>

  <component
      v-bind="bindRouterWrapper"
      :loading="fetching"
      :title="title"
      @hide="onHide"
  >

    <div v-if="step === 'send'">

      <ui-input-phone
          v-model="form.phone"
          label="Телефон"
          :required="true"
          lazy-rules
          unmasked-value
          autofocus
          :readonly="readonly"
          empty-return
          noformat-return
      />

    </div>
    <div v-else>

      <div class="q-mb-md">

        Телефон: {{$util.format.phone(form.phone)}}

        <span
            class="s-link text-primary"
            @click="step='send'"
            v-if="!readonly"
        >изменить</span>

      </div>


      <div class="q-mb-md">На Ваш номер было отправлено сообщение. Введите код ниже:</div>

      <q-input
          v-model="form.code"
          :color="confirmError ? 'red':'dark'"
          :label-color="confirmError ? 'red':'dark'"
          outlined
          size="4"
          maxlength="4"
          style="width: 90px;"
          input-style="font-size: 24px"
          autofocus
          type="tel"
          mask="####"
      />

    </div>

  </component>

</template>

<script>

import MVRoute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVRoute],
  props: {
    phone: {},
    readonly: {default: false},
    prevPhone: {default: null},
  },
  components: {},
  data() {
    return {
      form: {
        phone: this.phone || this.prevPhone,
        code: null
      },
      step: 'send',
      confirmError: false
    }
  },
  computed: {

    title() {
      return this.prevPhone ? 'Изменить номер' : 'Подтверждение номера'
    },

    actions() {

      const result = [];

      if (this.step === 'send') {

          result.push({
            label: 'Отравить код подтверждения',
            color: 'primary',
            loading: this.requestState.mutating,
            callback: this.onSend,
            disable: !this.$util.validate.checkPhone(this.form.phone) || (this.prevPhone && (this.form.phone === this.prevPhone))
          })

      } else {
        result.push({
          label: 'Подтвердить',
          color: 'primary',
          loading: this.requestState.mutating,
          callback: this.onSubmit
        })
      }

      return result
    },

  },
  async mounted() {
    if (this.form.phone) {
      //await this.onSend()
    }
  },
  methods: {
    async onSend() {

      try {
        await this.$store.dispatch('gql/mutation', {
          mutation: require('../../gql/mutation/confirm_phone_send.gql'),
          variables: {
            phone: this.form.phone
          },
          state: this.requestState
        })

        this.step = 'submit'
      } catch (e) {
        console.log(e)
      }
    },

    async onSubmit() {

      try {
        await this.$store.dispatch('gql/mutation', {
          mutation: require('../../gql/mutation/confirm_phone_submit.gql'),
          variables: {
            phone: this.form.phone,
            code: this.form.code,
          },
          state: this.requestState
        })

        this.visible = false
        this.onResolve && this.onResolve(this.form.phone)

      } catch (e) {
        console.log(e)
      }
    }

  },
  created() {

  },
  watch: {

  }
}

</script>

<style lang="scss" scoped>


</style>
