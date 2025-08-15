<template>

  <component
      v-bind="bindRouterWrapper"
      dialogWidth="500px"
      title="Авторизация"
      @hide="onHide"
  >


    <q-form ref="form" class="q-gutter-md">
      <q-input
          v-model="form.login"
          color="primary"
          outlined
          autofocus
          label="Логин"
      />
      <q-input
          v-model="form.pass"
          color="primary"
          outlined
          type="password"
          label="Пароль"
      />
    </q-form>
  </component>

</template>

<script>

import MVRoute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVRoute],
  props: {
    noRedirect: {},
    disableBasketTransfer: {default: false},
  },
  components: {},
  data() {
    return {
      form: {
        login: '',
        pass: '',
      },
      dialog: {
        mode: 'dialog'
      },
      confirmErrorName: null,
      response: {},
      rateTimeout: 0,
      interval: null,
    }
  },
  computed: {
    actions() {
      return [
        {
          label: 'Войти',
          callback: this.onLogin,
          loading: this.requestState.mutating
        }
      ]
    }
  },
  methods: {
    async onLogin() {
      try {
        if (await this.$refs.form.validate())
          await this.onLoginCommit()
      } catch (e) {
        console.log(e)
      }
    },
    async onLoginCommit() {

      try {

        const res = await this.$store.dispatch('gql/mutation', {
          mutation: require('../gql/mutation/login.gql'),
          variables: {
            login: this.form.login,
            pass: this.form.pass
          },
          state: this.requestState
        })

        if (res.result.success) {
          this.$q.cookies.set('token', res.payload.token, {expires: 100,  path: '/'})
          window.location.replace('')
        }

      } catch (e) {
        console.log(e)
      }
    },

  },
  created() {

  },
  beforeDestroy() {

  },

  mounted() {

  },
  watch: {

  }
}

</script>

<style lang="scss" scoped>


</style>
