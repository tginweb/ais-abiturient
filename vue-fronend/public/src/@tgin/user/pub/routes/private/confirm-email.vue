<template>

  <component
      v-bind="bindRouterWrapper"
      :loading="fetching"
      :title="title"
      @hide="onHide"
  >

    <div v-if="step === 'send'">

      <ui-input-email
          v-model="form.email"
          label="E-mail"
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

        E-mail: {{form.email}}

        <span
            class="s-link text-primary"
            @click="step='send'"
            v-if="!readonly"
        >изменить</span>

      </div>

      <div class="q-mb-md">На Ваш e-mail было отправлено сообщение. Введите код из него ниже:</div>

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
    email: {},
    readonly: {default: false},
    prevEmail: {default: null},
  },
  components: {},
  data() {
    return {
      form: {
        email: this.email || this.prevEmail,
        code: null
      },
      step: 'send',
      confirmError: false
    }
  },
  computed: {
    title() {
      return this.prevEmail ? 'Изменить e-mail' : 'Подтверждение e-mail'
    },

    actions() {

      const result = [];

      if (this.step === 'send') {
        result.push({
          label: 'Отравить код подтверждения',
          color: 'primary',
          loading: this.requestState.mutating,
          callback: this.onSend,
          disable: !this.$util.validate.checkEmail(this.form.email) || (this.prevEmail && (this.form.email === this.prevEmail))
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
    if (this.form.email) {
      //await this.onSend()
    }
  },
  methods: {
    async onSend() {

      this.onResolve(this.form.email)
      this.visible = false
      return

      try {
        await this.$store.dispatch('gql/mutation', {
          mutation: require('../../gql/mutation/confirm_email_send.gql'),
          variables: {
            email: this.form.email
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
          mutation: require('../../gql/mutation/confirm_email_submit.gql'),
          variables: {
            email: this.form.email,
            code: this.form.code,
          },
          state: this.requestState
        })

        this.visible = false
        this.onResolve && this.onResolve(this.form.email)

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
