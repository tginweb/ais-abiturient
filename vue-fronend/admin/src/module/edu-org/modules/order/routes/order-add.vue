<template>

  <component
      v-model="visible"
      :loading="fetching"
      dialogWidth="450px"
      title="Добавить абитуриента"
      v-bind="bindRouterWrapper"
      @hide="onHide"
  >
    <template v-slot:default>

      <q-form ref="form" class="q-gutter-md">

        <q-select
            v-model="eduType"
            :options="$store.state.edu_order.app.eduTypes"
            :rules="[val => !!val || 'Обязательное поле']"
            emit-value
            label="Уровень образования куда поступает"
            map-options
            option-label="name"
            option-value="id"
            outlined
        />

        <q-option-group
            v-model="by"
            :options="[
                {
                  label: 'СНИЛС',
                  value: 'snils'
                },
                {
                  label: 'Паспорт',
                  value: 'passport'
                },
            ]"
            color="primary"
            inline
        />

        <template v-if="by ==='snils'">
          <ui-input-snils
              v-if="!noSnils"
              v-model="snils"
              :rules="[val => !!val || 'Обязательное поле']"
              label="Снилс"
              outlined
          />
        </template>
        <template v-if="by ==='passport'">
          <q-input
              v-model="passportSerial"
              :rules="[val => !!val || 'Обязательное поле']"
              label="Паспорт серия"
              outlined
          />

          <q-input
              v-model="passportNumber"
              :rules="[val => !!val || 'Обязательное поле']"
              label="Паспорт нормер"
              outlined
          />
        </template>

      </q-form>


    </template>

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVroute],
  props: {},
  components: {},
  data() {
    return {
      by: 'snils',
      snils: null,
      noSnils: false,
      passportSerial: null,
      passportNumber: null,
      eduType: null
    }
  },
  computed: {
    actions() {
      return [
        {
          label: 'Создать',
          callback: this.onSubmit
        }
      ]
    }
  },
  methods: {
    async onSubmit() {
      this.$refs.form.validate().then(async (formValid) => {
        if (formValid) {
          try {
            const res = await this.$store.dispatch('gql/mutation', {
              mutation: require('../gql/order/mutation/orderAdd.gql'),
              variables: {
                eduType: this.eduType,
                by: this.by,
                snils: this.snils,
                passportSerial: this.passportSerial,
                passportNumber: this.passportNumber,
              }
            })

            if (res.result.success) {

              this.visible = false

              this.$nextTick(() => {
                setTimeout(() => {
                  this.$router.push({
                    name: 'edu.order:view',
                    params: {
                      entityId: res.payload.orderId,
                      edit: true
                    }
                  })
                }, 1000)
              })

            }
            console.log(res)

          } catch (e) {
            console.log(e)
          }

          if (this.onResolve)
            this.onResolve()
        }
      })
    },
  }
}

</script>

<style lang="scss" scoped>


</style>
