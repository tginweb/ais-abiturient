<template>

  <q-card class="" flat>

    <q-form
      @submit="onSubmit"
      class="q-px-sm"
      ref="form"
    >
      <q-card-section>

        <div class="text-h5">Восстановление пароля</div>

      </q-card-section>

      <template v-if="step=='request'">

        <q-card-section>

          <q-input
            :rules="[
            val => !!val || 'Обязательное поле',
            val => $util.validate.checkEmail(val) || 'Неверный формат'
          ]"
            clearable
            label="Email"
            lazy-rules
            square
            type="email"
            v-model="data.email"
          >
            <template v-slot:prepend>
              <q-icon name="email"/>
            </template>
          </q-input>

        </q-card-section>

        <q-separator dark />

        <q-card-actions class="q-pa-md">
          <q-btn
            @click="onSubmit"
            class="full-width"
            color="primary"
            label="Восстановить"
            size="lg"
            unelevated
          />
        </q-card-actions>

      </template>
      <template v-else-if="step=='success'">

        <q-card-section>

          На ваш адрес e-mail отправлена ссылка восстановления пароля

        </q-card-section>

        <q-card-actions>
          <q-btn
            @click="step = 'request'"
            class="full-width"
            color="primary"
            label="Запросить еще раз"
            outline
            size="lg"
            unelevated
          />
        </q-card-actions>

      </template>

    </q-form>

  </q-card>

</template>

<script>

  export default {
    props: {},
    data() {
      return {
        step: 'request',
        data: {
          email: '',
        }
      }
    },

    methods: {

      async onSubmit() {

        let query = this.data

        try {
          let {data: {res: {result}}} = await this.$apollo.mutate({
            mutation: require('@tgin/user/pub/gql/mutation/auth/PasswordRestoreRequest.gql'),
            variables: {
              login: this.data.email,
              lang: this.tLang
            }
          })

          this.$bus.emit('processMessages', result.messages)

          if (result.success) {
            this.step = 'success'
          }

        } catch (e) {


          console.log(e)
        }
      }
    }
  }
</script>
