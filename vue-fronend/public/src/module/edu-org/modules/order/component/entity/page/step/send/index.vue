<template>

  <div v-if="orderData" style="max-width: 1000px;">

    <q-banner class="col-grow bg-white text-red q-mb-lg" inline-actions>
      <div style="font-size: 22px">
        Внимательно проверьте все данные вашего заявления перед отправкой.
      </div>

      <template v-slot:action>

      </template>
    </q-banner>

    <q-btn class="q-mb-lg " color="primary" label="Нажмите для отправки в ВУЗ" size="lg" @click="onSubmit"/>


    <div class="row q-col-gutter-x-xl q-col-gutter-y-lg q-mb-lg">


      <div class="col-24 col-md-10">

        <COrderSectionPersonal :order="orderData"></COrderSectionPersonal>
        <COrderSectionEducation :order="orderData"></COrderSectionEducation>
        <COrderSectionAddress :order="orderData"></COrderSectionAddress>
        <COrderSectionOther :order="orderData"></COrderSectionOther>

      </div>

      <div class="col-24 col-md-14">

        <COrderSectionApplications :order="orderData"></COrderSectionApplications>
        <COrderSectionSubjects :order="orderData"></COrderSectionSubjects>
        <COrderSectionAchievements :order="orderData"></COrderSectionAchievements>
        <COrderSectionQuotes :order="orderData"></COrderSectionQuotes>
        <COrderSectionFiles :order="orderData"></COrderSectionFiles>

      </div>

    </div>

  </div>

</template>

<script>
import * as sections from '@project/components/entity/order/section'

export default {
  components: {
    ...sections
  },
  props: {
    order: {}
  },
  data() {
    return {
      orderData: this.$util.base.cloneDeep(this.order),
    }
  },
  methods: {
    async onSubmit() {

      this.$q.dialog({
        title: 'Подтвердите отправку заявления',
        message: 'Отправить заявление в ИРНИТУ?',
        cancel: true,
        persistent: true
      }).onOk(async () => {

        try {
          let {data: {res}} = await this.$apollo.mutate({
            mutation: require('~module/edu-org/modules/order/gql/order/mutation/old/send.gql'),
          })

          this.$bus.emit('processMessages', res.result.messages)

          if (res.result.success) {
            window.location.replace('/cab/order/view')
          }

        } catch (e) {

          console.log(e)
        }

      })


    }
  }
}
</script>


<style lang="scss" scoped>


</style>
