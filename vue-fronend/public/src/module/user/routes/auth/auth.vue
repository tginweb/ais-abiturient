<template>

    <div class="full-width row wrap justify-center items-center content-center">

      <div class="col" style="max-width: 500px">

        <ui-alerts :messages="messages" v-if="messages.length>0" class="q-mb-lg"/>

        <q-tabs
          v-model="tab"
          dense
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="login" label="Вход" />
          <q-tab name="register" label="Регистрация" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>

          <q-tab-panel name="login">

            <CLogin @changeTab="onChangeTab"></CLogin>

          </q-tab-panel>

          <q-tab-panel name="register">

            <CRegister @changeTab="onChangeTab"></CRegister>

          </q-tab-panel>

          <q-tab-panel name="password-request">

            <CPasswordRequest @changeTab="onChangeTab"></CPasswordRequest>

          </q-tab-panel>

          <q-tab-panel name="password-submit">

            <CPasswordSubmit @changeTab="onChangeTab"></CPasswordSubmit>

          </q-tab-panel>

        </q-tab-panels>


      </div>

    </div>

</template>

<script>

  import CLogin from './parts/login'
  import CRegister from './parts/register'
  import CPasswordRequest from './parts/password-request'
  import CPasswordSubmit from './parts/password-submit'

  export default {
    components: {
      CLogin,
      CRegister,
      CPasswordRequest,
      CPasswordSubmit
    },
    props: {
      value: {},
      mode: {
        default: 'login'
      }
    },
    data() {
      return {
        tab: this.$route.query.mode || this.mode,
        messages: []
      }
    },
    methods: {
      onChangeTab(tab) {
        this.tab = tab
      }
    },

    async mounted() {

      if (this.$route.query.op) {

        switch (this.$route.query.op) {

          case 'activate-confirm':
            try {
              let {data} = await this.$apollo.mutate({
                mutation:  require('@tgin/user/pub/gql/mutation/auth/ActivateConfirm.gql'),
                fetchPolicy: 'no-cache',
                variables: {
                  sac: this.queryParamsSac,
                  lang: this.tLang
                },
              })
              this.processResponseResult(data.res)
            } catch (e) {
              this.processResponseErrors(e)
            }
            break;

          case 'password-submit':
            this.tab = 'password-submit'
            break;
        }

      }
    },
    computed: {
      queryParamsSac() {
        return {
          sid: this.$route.query.sid,
          code: this.$route.query.code,
        };
      }
    },
  }
</script>
