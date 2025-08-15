<template>

  <q-card class="" flat>

    <template v-if="step=='activate'">

      <q-card-section>

        <div class="text-primary1 text-center" style="font-size: 17px;">
          <p><b>Вы успешно зарегистрированы!</b></p><p>Далее вам необходимо активировать аккаунт. Ссылка активации отправлена на ваш e-mail.</p><p>Перейдите по данной ссылке для активации</p>
        </div>

      </q-card-section>

      <q-card-actions class="">
        <q-btn
          label="Запросить еще раз"
          @click="onActivateRequest"
          class="full-width"
          color="primary"
          size="lg"
          unelevated
        />
      </q-card-actions>

    </template>

    <template v-else-if="step='register'">

      <q-card-section>

        <q-form
          @submit="onSubmit"
          class="q-px-sm"
          ref="form"
        >

          <h5 class="q-mt-sm q-mb-md text-center">Ваш профиль</h5>

          <div class="row q-col-gutter-sm">

            <div class="col-24">
              <q-input
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
                v-model="val.email"
              >
                <template v-slot:prepend>
                  <q-icon name="email"/>
                </template>
              </q-input>
            </div>

            <div class="col-24">
              <q-input
                label="Пароль"
                :rules="[
                   val => !!val || 'Обязательное поле',
                   val => val.length >= 7 || 'Длина пароля должна быть больше 6 символов',
                ]"
                outlined
                reactive-rules
                square
                type="password"
                v-model="val.password"
              >
                <template v-slot:prepend>
                  <q-icon name="lock"/>
                </template>
              </q-input>
            </div>

            <div class="col-24">
              <q-input
                label="Повторите пароль"
                :rules="[
                  v => !!v || 'Обязательное поле',
                  v => v == val.password || 'Пароли не совпадают',
                ]"
                outlined
                reactive-rules
                square
                type="password"
                v-model="val.password2"
              >
                <template v-slot:prepend>
                  <q-icon name="lock"/>
                </template>
              </q-input>

            </div>

          </div>

          <h5 class="q-mt-sm q-mb-md text-center">Персональные данные</h5>

          <div class="row q-col-gutter-sm">

            <div class="col-24">
              <q-input
                label="Фамилия"
                :rules="[
                  v => !!v || 'Обязательное поле',
                ]"
                lazy-rules
                outlined
                reactive-rules
                square
                v-model="val.lastName"
              >
              </q-input>

            </div>

            <div class="col-24">
              <q-input
                label="Имя"
                :rules="[
                 v => !!v || 'Обязательное поле',
                ]"
                lazy-rules
                outlined
                reactive-rules
                square
                v-model="val.firstName"
              >
              </q-input>
            </div>

            <div class="col-24">
              <q-input
                label="Ваш телефон"
                :rules="[
                  v => !!v || 'Обязательное поле',
                ]"
                lazy-rules
                mask="+##############"
                outlined
                reactive-rules
                unmasked-value
                v-model="val.phone"
              >
              </q-input>
            </div>

            <div class="col-24">

              <q-select
                :options="$store.state.edu_order.app.orderTypes"
                :rules="[
                  v => !!v || 'Обязательное поле',
                ]"
                emit-value
                label="Поступаю на"
                map-options
                option-label="name"
                option-value="id"
                outlined
                v-model="val.eduType"
              />

            </div>

            <div class="col-24">
              <div class="q-mb-sm">
                Гражданство:
              </div>

              <q-option-group
                  v-model="val.citizenship"
                  :options="[
                      {label: 'РФ', value: 'russia'},
                      {label: 'другая страна', value: 'other'},
                  ]"
                  color="primary"
                  inline
              />
            </div>

            <div class="col-24" v-if="val.citizenship==='russia' && val.eduType===2">
              <ui-input-snils
                  :rules="[val => !!val || 'Обязательное поле']"
                  label="Ваш номер СНИЛС"
                  outlined
                  v-model="val.snils"
              />
            </div>

            <div class="col-24" >

              <q-checkbox
                  label="не из Российской Федерации"
                  outlined
                  v-model="notRussia"
              >
              </q-checkbox>

            </div>

            <div class="col-24" v-if="!notRussia">


              <ui-input-address
                  :rules="[val => !!val || 'Обязательное поле']"
                  :valueData="true"
                  fromBound="region"
                  label="Ваш регион"
                  outlined
                  toBound="region"
                  v-model="val.region"
              >
              </ui-input-address>

            </div>

            <div class="col-24">

              <q-checkbox
                label="даю согласие на обработку персональных данных"
                outlined
                v-model="val.consent"
              >
              </q-checkbox>

            </div>

          </div>

        </q-form>

      </q-card-section>

      <q-card-actions class="q-px-lg">
        <q-btn
          label="Регистрация"
          @click="onSubmit"
          class="full-width"
          color="primary"
          size="lg"
          unelevated
        />
      </q-card-actions>

    </template>

  </q-card>

</template>

<script>

  export default {
    components: {},
    props: {},
    data() {
      return {
        step: 'register',
        result: false,
        notRussia: false,

        val: {
          email: '',
          password: '',
          password2: '',
          lastName: '',
          firstName: '',
          secondName: '',
          region: {},
          citizenship: 'russia',
          snils: '',
          phone: '',
          eduType: 2,
          consent: false,
          lang: 'ru'
        }
      }
    },

    methods: {

      onSubmit() {

        this.$refs.form.validate().then(async (success) => {

          if (success) {

            try {

              let {data: {res}} = await this.$apollo.mutate({
                mutation: require('@tgin/user/pub/gql/mutation/auth/Register.gql'),
                variables: {
                  data: this.val,
                }
              })

              this.$bus.emit('processMessages', res.result.messages);

              if (res.result.success) {

                this.step = 'ok'

                setTimeout(()=>{
                  window.location.replace('/pub/auth')
                }, 1000)

              } else {

              }

             // this.step = 'activate'

            } catch (e) {

              //this.messagesController.processMessages(this.$errors.processRequestErrors(e))
            }

          }

        }).catch((e) => {

        })

      },

      async onActivateRequest() {

        try {
          let {data} = await this.$apollo.mutate({
            mutation: require('@tgin/user/pub/gql/mutation/auth/ActivateRequest.gql'),
            variables: {
              login: this.val.email,
              lang: this.tLang
            }
          })
          this.messagesController.processPayload(data.res.payload)
        } catch (e) {
          this.messagesController.processMessages(this.$errors.processRequestErrors(e))
        }

      },
    }
  }
</script>
