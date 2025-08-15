<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :loading="fetching"
      title="ФИС импорт пакета ЕГЭ"
      @hide="onHide"
  >

    <q-form ref="form">
      <q-input
        type="textarea"
        v-model="packet"
        outlined
        label="Пакет"
        input-style="height: calc(100vh - 300px)"
      />

    </q-form>

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVroute],
  props: {
    onResolve: {},
    ids: {}
  },
  components: {
  },
  data() {
    return {
      packet: `Серебренников%Александр%Дмитриевич%2517%440471%Информатика и ИКТ%65%2021%38%Действующий%0%%%Отсутствует
Серебренников%Александр%Дмитриевич%2517%440471%Сочинение%1%2021%38%Действующий%0%%%Отсутствует
Серебренников%Александр%Дмитриевич%2517%440471%Математика%50%2021%38%Действующий%0%%%Отсутствует
Серебренников%Александр%Дмитриевич%2517%440471%Русский язык%61%2021%38%Действующий%0%%%Отсутствует
Соколов%Илья%Вячеславович%7617%942716%Физика%57%2021%75%Действующий%0%%%Отсутствует
Соколов%Илья%Вячеславович%7617%942716%Русский язык%67%2021%75%Действующий%0%%%Отсутствует
Соколов%Илья%Вячеславович%7617%942716%Математика%70%2021%75%Действующий%0%%%Отсутствует
Соколов%Илья%Вячеславович%7617%942716%Сочинение%1%2021%75%Действующий%0%%%Отсутствует`
    }
  },
  computed: {
    actions() {
      return [
        {
          label: 'Импортировать',
          callback: this.onSubmit
        }
      ]
    },
  },

  methods: {

    onSubmit() {

      this.$refs.form.validate().then(async (success) => {

        if (success) {

          try {

            let {data: {res: {result}}} = await this.$apollo.mutate({
              mutation: require('../gql/order/mutation/fisEgePacketImport.gql'),
              variables: {
                content: this.packet,
              }
            })

            this.$bus.emit('processMessages', result.messages);

            if (result.success) {
              this.onResolve && this.onResolve()
              this.visible = false
            }

          } catch (e) {

            console.log(e)
          }

        }

      }).catch((e) => {

      })

    },
  },
  watch: {

  }

}

</script>

<style lang="scss" scoped>


</style>
