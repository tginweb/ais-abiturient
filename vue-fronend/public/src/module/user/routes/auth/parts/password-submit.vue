<template>

  <q-card flat>

    <q-form
      ref="form"
      class="q-px-sm"
    >
      <q-card-section>

        <div class="text-h5">{{ t.auth.PASSWORD_CHANGE }}</div>

      </q-card-section>

      <template v-if="step=='init'">

        <q-card-section>

          загрузка

        </q-card-section>

      </template>
      <template v-else-if="step=='init_error'">
        <q-card-section>

          Ошибка

        </q-card-section>
      </template>
      <template v-else-if="step=='submit'">

        <q-card-section>

          <q-form ref="changeForm">

            <div class="row">

              <div class="col-24">

                <q-input
                  v-model="data.password"
                  :label="t.auth.PASSWORD"
                  :rules="[
                         val => !!val || t.common.REQUIRED_FIELD,
                         val => val.length >= 7 || t.auth.PASSWORD_ERROR_LENGTH,
                      ]"
                  lazy-rules
                  outlined
                  reactive-rules
                  square
                  type="password"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock"/>
                  </template>
                </q-input>

              </div>

              <div class="col-24">
                <q-input
                  v-model="data.password2"
                  :label="t.auth.REPEAT_PASSWORD"
                  :rules="[
                        val => !!val || t.common.REQUIRED_FIELD,
                        v => v == data.password || t.auth.PASSWORD_NOT_MATCH,
                      ]"
                  lazy-rules
                  outlined
                  reactive-rules
                  square
                  type="password"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock"/>
                  </template>
                </q-input>

              </div>

            </div>

          </q-form>

        </q-card-section>

        <q-separator dark/>

        <q-card-actions class="q-px-md q-pb-md q-pt-none">
          <q-btn
            :label="t.auth.PASSWORD_CHANGE"
            class="full-width"
            color="primary"
            size="lg"
            unelevated
            @click="onSubmit"
          />
        </q-card-actions>

      </template>
      <template v-else-if="step=='success'">

        <q-card-section>
          {{ t.auth.PASSWORD_RESTORE_SUCCESS }}
        </q-card-section>

        <q-card-actions>
          <q-btn
            :label="t.auth.LOGIN"
            class="full-width"
            color="primary"
            outline
            size="lg"
            unelevated
            @click="$emit('changeTab', 'login')"
          />
        </q-card-actions>

      </template>

    </q-form>

  </q-card>

</template>

<script>

export default {
  components: {},
  props: {},
  data() {
    return {
      step: 'init',
      messages: [],
      data: {
        password: '',
        password2: ''
      }
    }
  },
  mounted() {
    this.onRouteValidate();
  },
  methods: {
    async onRouteValidate() {
      try {
        const {data: {res: {result}}} = await this.$apollo.mutate({
          mutation: require('@tgin/user/pub/gql/mutation/auth/PasswordRestoreCheck.gql'),
          fetchPolicy: 'no-cache',
          variables: {
            sac: this.queryParamsSac
          },
        })
        this.processRequestResult(result)
        if (result.success) {
          this.step = 'submit'
        } else {
          this.step = 'init_error'
        }
      } catch (e) {

        console.log(e)
        this.step = 'init_error'
      }
    },
    async onSubmit() {

      this.$refs.changeForm.validate().then(async (success) => {
        if (success) {
          try {
            const {data: {res: {result}}} = await this.$apollo.mutate({
              mutation: require('@tgin/user/pub/gql/mutation/auth/PasswordRestoreSubmit.gql'),
              fetchPolicy: 'no-cache',
              variables: {
                password: this.data.password,
                sac: this.queryParamsSac
              },
            })
            this.processRequestResult(result)

            if (result.success)
              this.step = 'success'
          } catch (e) {

            console.log(e)
          }
        }
      }).catch((e) => {
      })

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
