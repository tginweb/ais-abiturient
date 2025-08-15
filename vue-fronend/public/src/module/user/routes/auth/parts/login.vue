<template>

  <q-card class="" flat>

    <q-form
      v-if="state=='login'"
      ref="form"
      class=""
      @submit="onSubmit"
    >

      <q-card-section class="q-pb-xs q-gutter-y-md">


        <q-input
          v-model="val.email"
          :rules="[
            val => !!val || 'Обязательное поле',
            val => $util.validate.checkEmail(val) || 'Неверный формат'
          ]"
          label="Email"
          lazy-rules
          outlined
          reactive-rules
          square
          type="email"
        >
          <template v-slot:prepend>
            <q-icon name="email"/>
          </template>
        </q-input>

        <q-input
          v-model="val.password"
          label="Пароль"
          :rules="[
            val => !!val || 'Обязательное поле',
          ]"
          outlined
          reactive-rules
          square
          type="password"
        >
          <template v-slot:prepend>
            <q-icon name="lock"/>
          </template>
        </q-input>


      </q-card-section>

      <q-card-actions class="q-px-md q-pb-md q-pt-md">
        <q-btn
          label="Войти"
          class="full-width"
          color="primary"
          size="lg"
          unelevated
          @click="onSubmit"
        />
      </q-card-actions>

      <div class="text-center q-mt-md">
        <a class="s-link" href="#"
           @click.prevent="$emit('changeTab', 'password-request')">Забыли пароль?</a>
      </div>

    </q-form>

    <template v-else-if="state=='not_active'">

      <q-card-section>

        <div class="text-red ">
          Данная учетная запись не активирована. Необходимо подтвердить адрес E-mail.
        </div>

      </q-card-section>

      <q-card-actions class="">

        <q-btn
          class="full-width"
          color="primary"
          @click="onActivateRequest"
        >
          Подтвердить E-mail
        </q-btn>

      </q-card-actions>

    </template>

  </q-card>

</template>

<script>


export default {
  props: {},
  data() {
    return {
      messages: [],
      state: 'login',
      val: {
        email: '',
        password: ''
      }
    }
  },

  methods: {

    async onActivateRequest() {

      try {
        let {data: {res}} = await this.$apollo.mutate({
          mutation: require('@tgin/user/pub/gql/mutation/auth/ActivateRequest.gql'),
          variables: {
            login: this.val.email,
            lang: this.tLang
          }
        })
        this.state = 'login'

        this.processRequestResult(res.result);

        //this.processResponseResult(data.res)
      } catch (e) {
       // this.processResponseErrors(e)
      }

    },

    onSubmit() {

      this.$refs.form.validate().then(async (success) => {

        if (success) {

          try {

            const res = await this.$store.dispatch('gql/mutation', {
              mutation: require('@tgin/user/pub/gql/mutation/auth/Login.gql'),
              variables: {
                data: {
                  login: this.val.email,
                  password: this.val.password,
                },
              }
            })


            if (res.result.success) {
              this.$q.cookies.set('token', res.payload.token, {expires: 100,  path: '/'})
              window.location.replace('')
            }

          } catch (e) {
            console.log(e)
          }

        }

      }).catch((e) => {

      })

    }
  }
}
</script>
