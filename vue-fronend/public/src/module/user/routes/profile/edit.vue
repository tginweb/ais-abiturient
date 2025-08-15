<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actions="actions"
    :actionsClose="true"
    :loading="fetching"
    title="Профиль"
    @hide="onHide"
    v-if="inited"
  >


    <div v-if="$store.getters['user/userAvatar']" class="c-avatar q-mb-sm text-center">

      <ui-avatar :src="$store.getters['user/userAvatarImageSrc']" size="64px"/>

      <div>
        <span class="text-primary cursor-pointer" @click="$store.dispatch('router/nav', {name: 'user:profile.edit-avatar'})">
          Изменить аватарку
        </span>
      </div>

    </div>

    <q-form ref="form" class="q-gutter-md q-pb-md">

      <q-input
        v-model="form.PHONE"
        :disable="form.LOGIN_FORMAT === 'phone'"
        label="Телефон"
        :readonly="form.LOGIN_FORMAT === 'phone'"
        :rules="[
          val => !!val || 'Обязательное поле',
          val => $util.validate.checkPhone(val) || 'Неверный формат',
        ]"
        fill-mask
        lazy-rules
        mask="+7 (###) ### - ####"
        unmasked-value
      />

      <q-input
        v-model="form.NAME_FULL"
        label="Имя, фамилия"
        maxlength="100"
      />

      <q-input
        v-model="form.EMAIL"
        :rules1="[
            val => !!val || 'Обязательное поле',
            val => $util.validate.checkEmail(val) || 'Неверный формат',
          ]"
        label="E-mail"
        lazy-rules
        maxlength="100"
      />

      <q-input
        v-model="form.PERSONAL_BIRTHDAY"
        fill-mask="_" hint="Чтобы понимать в какой день вас приятно порадовать"
        label="Дата рождения"
        mask="##.##.####"
      >
        <template v-slot:append>
          <q-icon class="cursor-pointer" name="event">
            <q-popup-proxy ref="qDateProxy" transition-hide="scale" transition-show="scale">
              <q-date
                v-model="form.PERSONAL_BIRTHDAY"
                mask="DD.MM.YYYY"
                @input="() => $refs.qDateProxy.hide()"
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <div class="q-pt-md">
        <q-checkbox
          v-model="form.UF_IS_COMPANY"
          color="primary"
          label="Юридическое лицо"
        />
      </div>

      <div v-if="form.UF_IS_COMPANY" ref="personTypeFields">

        <q-input
          v-model="form.UF_COMPANY_NAME"
          :rules="[
              val => !!val || 'Обязательное поле',
            ]"
          class="q-mt-none"
          label="Название организации"
          lazy-rules
          maxlength="120"
        />

        <q-input
          v-model="form.UF_COMPANY_ADDRESS"
          :rules="[
              val => !!val || 'Обязательное поле',
            ]"
          label="Юридический адрес"
          lazy-rules
          maxlength="300"
        />

        <div>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="form.UF_COMPANY_INN"
                :rules="[
                    val => !!val || 'Обязательное поле',
                    val => $util.validate.checkInn(val) || 'Неверный формат',
                  ]"
                label="ИНН"
                lazy-rules
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.UF_COMPANY_KPP"
                :rules="[
                     val => $util.validate.checkKpp(val, true) || 'Неверный формат',
                 ]"
                label="КПП"
                lazy-rules
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.UF_COMPANY_RS"
                :rules="[
                    val => !!val || 'Обязательное поле',
                    val => $util.validate.checkRs(val) || 'Неверный формат',
                  ]"
                label="Расчетный счет"
                lazy-rules
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.UF_COMPANY_BIK"
                :rules="[
                    val => !!val || 'Обязательное поле',
                    val => $util.validate.checkBik(val) || 'Неверный формат',
                  ]"
                label="Бик"
                lazy-rules
              />
            </div>
          </div>

        </div>

      </div>

    </q-form>

  </component>

</template>

<script>

import MVRoute from '@common/router/mixin/vroute'

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
      request: {
        process: null,
        status: null
      }
    }
  },
  computed: {

    actions() {

      const result = [];

      result.push({
        label: 'Сохранить и закрыть',
        color: 'primary',
        loading: this.request.process,
        callback: () => {
          this.onSubmit()
        }
      })

      return result
    },

    personTypeOptions() {
      return this.$store.state.sale.app.personTypes.map(item => ({
        value: item.ID,
        label: item.NAME
      }))
    },

  },
  mounted() {

    console.log('CCCCC')
  },
  methods: {

    onSubmit() {

      this.$refs.form.validate().then(async (success) => {

        if (success) {

          try {

            this.request.process = true
            this.request.status = 'process'

            const {data} = await this.$apollo.mutate({
              mutation: require('~module/user/gql/user/mutation/userUpdate.gql'),
              variables: {
                form: this.form
              },
            })

            this.actionRes = data.res

            this.$bus.emit('processMessages', data.res.result.messages);

            if (data.res.result.success) {
              this.request.status = 'success'
              await this.$store.dispatch('user/fetchUser')
              this.visible = false
            } else {
              this.request.status = 'error'
            }

          } catch (e) {
            console.log(e)
          }

          this.request.process = false
        }
      })
    },
  },
  created() {
    this.form = this.$util.base.cloneDeep(this.$store.getters['user/user'])
    this.inited = true
  },
  watch: {
    'form.PERSON_TYPE_ID'(v, prev) {
      if (prev) {
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
