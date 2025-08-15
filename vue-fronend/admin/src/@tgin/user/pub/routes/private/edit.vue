<template>

  <component
      v-bind="bindRouterWrapper"
      :loading="fetching"
      title="Профиль"
      @hide="onHide"
      v-if="inited"
  >


    <div
        v-if="$store.getters['user/avatarImageSrc']"
        class="c-avatar q-mb-sm text-center cursor-pointer"
        @click="$router.push({name: 'user:profile.edit-avatar'})"
    >
      <ui-avatar :src="$store.getters['user/avatarImageSrc']" size="64px"/>

      <div>
        <span class="text-primary cursor-pointer">
          Изменить аватарку
        </span>
      </div>
    </div>

    <q-form
        ref="form"
        class="row q-col-gutter-md q-mb-lg"
    >

      <ui-input-phone
          v-model="form.PHONE"
          label="Телефон"
          :readonly="user.LOGIN_FORMAT === 'phone'"
          :required="true"
          lazy-rules
          unmasked-value
          class="col-24"
      />

      <ui-input-phone
          v-if="false"
          v-model="form.PHONE"
          label="Телефон"
          :readonly="user.LOGIN_FORMAT === 'email'"
          :required="true"
          lazy-rules
          unmasked-value
          class="col-24"
          :rules="[
               val => compPhoneConfirmed || 'Необходимо подтвердить номер',
          ]"
      >

        <template v-slot:append v-if="form.PHONE">

          <q-btn
              v-if="!compPhoneConfirmed"
              label="подтвердить"
              flat
              icon="error_outline"
              dense
              color="warning"
              @click="onPhoneConfirm"
          />

        </template>

      </ui-input-phone>


      <div class="col-24">
        <div class="row q-col-gutter-md">
          <q-input
              v-model="form.NAME"
              label="Имя"
              maxlength="100"
              class="col-12"
              :rules="[
                val => !!val || 'Обязательное поле',
              ]"
          />
          <q-input
              v-model="form.LAST_NAME"
              label="Фамилия"
              maxlength="100"
              class="col-12"
          />
        </div>
      </div>

      <ui-input-email
          v-model="form.EMAIL"
          label="E-mail"
          lazy-rules
          maxlength="100"
          class="col-24"
          :required="true"
          :readonly="user.LOGIN_FORMAT === 'email'"
          :rules="[
               val => compEmailConfirmed || 'Необходимо подтвердить e-mail',
          ]"
      >
        <template v-slot:append v-if="form.EMAIL">

          <q-btn
              v-if="!compEmailConfirmed"
              label="подтвердить"
              flat
              icon="error_outline"
              dense
              color="warning"
              @click="onEmailConfirm"
          />

        </template>
      </ui-input-email>

      <ui-input-date
          v-model="form.PERSONAL_BIRTHDAY"
          hint="Чтобы понимать в какой день вас приятно порадовать"
          label="Дата рождения"
          class="col-24"
          :lazy-rules="true"
      />


    </q-form>

  </component>

</template>

<script>

import MVRoute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVRoute],
  props: {
    pr: {}
  },
  components: {},
  data() {
    return {
      inited: false,
      form: {},
      entityChanged: false
    }
  },
  computed: {

    actions() {

      const result = [];

      result.push({
        label: 'Сохранить и закрыть',
        color: 'primary',
        loading: this.requestState.mutating,
        callback: this.onSubmit
      })

      return result
    },

    personTypeOptions() {
      return this.$store.state.sale.app.personTypes.map(item => ({
        value: item.ID,
        label: item.NAME
      }))
    },

    user() {
      return this.$store.getters['user/user']
    },

    compPhoneConfirmed() {
      return this.form.PHONE === this.entityState.PHONE
    },

    compEmailConfirmed() {
      return this.form.EMAIL === this.entityState.EMAIL
    },

  },
  mounted() {

  },
  methods: {
    onEmailConfirm() {
      this.$router.push({
        name: 'user:confirm.email',
        params: {
          email: this.form.EMAIL,
          onResolve: () => {
            this.entityChanged = true
            this.entityState.EMAIL = this.form.EMAIL
            this.$refs.form.validate()
          }
        },
      })
    },

    onPhoneConfirm() {

      this.$router.push({
        name: 'user:confirm.phone',
        params: {
          phone: this.form.PHONE,
          onResolve: () => {
            this.entityChanged = true
            this.entityState.PHONE = this.form.PHONE
            this.$refs.form.validate()
          }
        },
      })
    },

    async onSubmitCommit() {

      try {
        await this.$store.dispatch('gql/mutation', {
          mutation: require('@tgin/user/core/gql/mutation/profile.gql'),
          variables: {
            form: this.form
          },
          state: this.requestState
        })

        await this.$store.dispatch('user/fetch')
        this.entityChanged = false
        this.visible = false

      } catch (e) {
        console.log(e)
      }
    },

    async onSubmit() {
      try {
        if (await this.$refs.form.validate())
          await this.onSubmitCommit()
      } catch (e) {
        console.log(e)
      }
    },

  },
  created() {

    this.entity = this.user
    this.entityState = this.$util.base.cloneDeep(this.user)

    this.form = {
      PHONE: this.entityState.PHONE,
      LAST_NAME: this.entityState.LAST_NAME,
      NAME: this.entityState.NAME,
      SECOND_NAME: this.entityState.SECOND_NAME,
      EMAIL: this.entityState.EMAIL,
      PERSONAL_BIRTHDAY: this.entityState.PERSONAL_BIRTHDAY,
      PROP: this.$util.base.cloneDeep(this.$store.getters['user/propVal'])
    }

    this.$nextTick(() => {
      this.inited = true
    })

  },
  watch: {
    visible(v) {
      if (!v) {
        if (this.entityChanged) {
          this.$store.dispatch('user/fetch')
        }
      }
    },

    'form.PROP.IS_COMPANY'(v, prev) {
      if (!this.inited)
        return;

      if (v && !prev) {
        this.$nextTick(() => {
          this.$util.dom.scrollTo({el: this.$refs.personTypeFields})
        })
      }
    }
  }
}

</script>

<style lang="scss" scoped>


</style>
