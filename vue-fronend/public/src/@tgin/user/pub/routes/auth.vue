<template>

  <component
      v-bind="bindRouterWrapper"
      dialogWidth="500px"
      title="Вход в личный кабинет"
      @hide="onHide"
      :loadind="requestState.fetching"
  >
    <template v-if="currentStepId==='find' || currentStepId==='register' || currentStepId==='details'">

      <div class="">

        <q-tabs
            v-model="modeId"
            active-color="primary"
            class="text-primary q-mb-sm"
            dense
            align="left"
            narrow-indicator
            :breakpoint="0"
        >
          <q-tab label="Телефон" name="phone" class="q-px-none q-mr-md"/>
          <q-tab label="E-mail" name="email" class="q-px-none q-mr-md"/>
        </q-tabs>

        <q-form ref="form">

          <q-tab-panels v-model="modeId" animated style="overflow:visible;">

            <q-tab-panel class="q-px-none" name="phone">

              <div class="q-gutter-y-lg q-pb-sm">

                <ui-input-phone
                    v-model="form.phone"
                    :disable="rateTimeout > 0"
                    class="--size-lg"
                    mask="+7 ### ### ## ##"
                    placeholder="введите номер"
                    unmasked-value
                    autofocus
                    outlined
                    type="tel"
                />

              </div>

            </q-tab-panel>

            <q-tab-panel class="q-px-none" name="email">

              <div class="q-gutter-y-lg q-pb-sm">

                <ui-input-email
                    v-model="form.email"
                    class="--size-lg"
                    label="Адрес e-mail"
                    placeholder="введите e-mail"
                    :required="true"
                    :lazy-rules="true"
                    outlined
                    autofocus
                    :disable="rateTimeout > 0"
                />

              </div>

            </q-tab-panel>

          </q-tab-panels>

        </q-form>

      </div>

      <div v-if="rateTimeout > 0" class="q-mt-sm" style="color:#9B9895;">
        Запросить код повторно можно через {{ rateTimeout }} сек
      </div>

      <div v-else-if="false" class="">
        Отправим на него сообщенние с кодом подтверждения
      </div>

    </template>

    <template v-else>

      <div class="q-mb-sm flex items-center">

        <div v-if="modeId==='phone'">
          Отправили на {{ form.phone }}
        </div>
        <div v-else>
          Отправили на {{ form.email }}
        </div>

        <a
            href="#"
            class="text-primary s-link q-ml-md"
            @click.prevent="goStep('find')"
        >изменить</a>

      </div>

      <div class="q-mb-sm">Введите код из сообщения</div>

      <div class="q-mb-md">

        <q-input
            v-model="form.code"
            :color="confirmErrorName === 'SA_WRONG_CODE' ? 'red':'dark'"
            :label-color="confirmErrorName === 'SA_WRONG_CODE' ? 'red':'dark'"
            outlined
            size="4"
            maxlength="4"
            style="width: 90px;"
            input-style="font-size: 24px"
            autofocus
            type="tel"
        />

      </div>

      <div v-if="rateTimeout > 0 && false" class="" style="color:#9B9895;">
        Запросить код повторно можно через {{ rateTimeout }} сек
      </div>

      <div v-else class="text-right">
        <q-btn color="primary" flat label="Отправить код еще раз" @click="resend"/>
      </div>

    </template>

  </component>

</template>

<script>

import MVRoute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVRoute],
  props: {
    phone: {default: '+7 '},
    email: {default: ''},
    redirect: {default: true},
    redirectNative: {default: true},
    refetchScope: {default: true},
    disableBasketTransfer: {default: false},
  },
  components: {},
  data() {
    return {
      currentStepId: 'find',
      modeId: 'email',

      form: {
        phone: this.phone,
        email: this.email,
        code: '',
      },

      needDetails: null,
      confirmErrorName: null,

      response: {},

      steps: {
        phone: {
          title: 'Вход по номеру телефона'
        },
        code: {
          title: 'Введите код из смс'
        },
      },

      rateTimeout: 0,
      interval: null,

      by: ['phone', 'email']
    }
  },
  computed: {
    currentStepData() {
      return this.steps[this.currentStepId]
    },
    actions() {

      const result = [];

      if (this.currentStepId === 'find') {
        result.push({
          label: 'Войти',
          color: 'primary',
          callback: () => this.actionLoginRequest()
        })
      } else if (this.currentStepId === 'register') {
        result.push({
          label: 'Регистрация',
          color: 'primary',
          callback: () => this.actionLoginRequest(true)
        })
      } else if (this.currentStepId === 'details') {
        result.push({
          label: 'Войти',
          color: 'primary',
          callback: () => this.actionLoginRequest(true)
        })
      }

      return result
    },
  },
  methods: {

    onPincode(code) {
      this.form.code = code
    },

    goStep(name) {
      if (name === 'confirm') {
        // this.form.code = '';
      }
      this.currentStepId = name
    },

    async actionLoginRequest() {
      try {
        if (await this.$refs.form.validate())
          await this.actionLoginRequestCommit()
      } catch (e) {
        console.log(e)
      }
    },

    async actionLoginRequestCommit(filled = false) {

      try {
        this.needDetails = null

        const {state, payload} = await this.$store.dispatch('gql/mutation', {
          mutation: require('../gql/mutation/login_request.gql'),
          variables: {
            by: this.modeId,
            phone: this.form.phone,
            email: this.form.email,
          },
          state: this.requestState,
          returnResult: false,
        })

        if (state.status === 'details') {
          this.goStep('details')
          this.needDetails = payload.fields
        } else {
          this.rateTimeout = 60
          this.goStep('confirm')
        }

      } catch (e) {

        switch (e.name) {
          case 'RATE_LIMIT':
            this.rateTimeout = e.data.ttl
            break
        }

        console.log(e.name)
      }

    },

    async actionLoginConfirm() {

      try {
        const payload = await this.$store.dispatch('gql/mutation', {
          mutation: require('../gql/mutation/login_confirm.gql'),
          variables: {
            by: this.modeId,
            email: this.form.email,
            phone: this.form.phone,
            code: this.form.code,
            sid: '',
            disableBasketTransfer: this.disableBasketTransfer
          },
          state: this.requestState
        })

        if (payload.userId) {

          let redirectUrl

          if (this.redirect) {

            if (this.redirect === 'current-route') {
              redirectUrl = this.$route.fullPath
            } else if (this.redirect === true) {
              redirectUrl = '/personal/'
            } else {
              redirectUrl = this.redirect
            }

            if (this.redirectNative) {
              window.location.replace(redirectUrl)
            } else {
              this.$router.push(redirectUrl)
            }

          }

          if (!redirectUrl || !this.redirectNative) {
            if (this.refetchScope) {
              await this.$store.dispatch('scopesRefetch', ['user'])
              await this.$store.dispatch('sale/basketFetch')
            }
            this.$bus.emit('user:auth')
          }

          this.onResolve && this.onResolve()
        }

      } catch (e) {
        this.confirmErrorName = e.name
      }

    },

    async resend() {
      this.actionLoginRequest()
    }
  },
  created() {
    this.interval = setInterval(() => {
      if (this.rateTimeout && this.rateTimeout > 0) {
        this.rateTimeout--;
      }
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },

  mounted() {
    if (this.phone && this.$util.validate.checkPhone('7' + this.phone)) {
      this.$nextTick(() => {
        this.actionLoginRequest()
      })
    }
  },
  watch: {

    'form.phone'(val) {

      return;

      if (this.$util.validate.checkPhone('7' + val)) {
        this.actionLoginRequest();
      }
    },

    'form.code'(val) {
      if (val.length === 4) {
        this.actionLoginConfirm();
      }
    }
  }
}

</script>

<style lang="scss" scoped>


</style>
