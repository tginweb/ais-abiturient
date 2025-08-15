<template>

  <div class="com s-info-section">

    <div class="__header">Вступительные испытания</div>

    <template v-if="orderData.eduTypeSlug=='bak'">

      <q-markup-table
        class="c-subjects s-table-data q-mb-md"
        flat
        v-if="entranceData.subjects.length"
      >
        <thead>
        <tr class="text-left">
          <th class="dense">Предмет</th>
          <th>Балл</th>
          <th>Статус</th>
          <th></th>
        </tr>
        </thead>
        <tbody>

        <tr
          class="__item"
          v-for="item in entranceData.subjects"
        >
          <td class="__item__label dense">
            {{item.subjectDoc.name}}
          </td>
          <td class="__item__result">
            <template v-if="item.status=='ready'">
              {{item.score}}
            </template>
          </td>
          <td class="__item__status">
            {{$util.base.variants(item.status, {
            'ready': 'сдан',
            'notready': 'собираюсь сдавать',
            'internal': 'собираюсь сдавать в ИРНИТУ',
            })}}

            {{item.year ? ' в ' + item.year : ''}}
          </td>
          <td>
            <q-icon
                name="far fa-check-circle"
                title="проверен"
                v-if="item.checked"
                color="primary"
            />
          </td>
        </tr>
        </tbody>

      </q-markup-table>
      <div class="text-grey-7" v-else>
        предметы не указаны
      </div>

    </template>
    <template v-if="orderData.eduTypeSlug=='mag'">
       проф. испытание
    </template>

    <q-list class="__items">
      <q-item class="__item" v-if="orderData.eduTypeSlug=='spo'">
        <q-item-section class="__title">Средий балл аттестата</q-item-section>
        <q-item-section class="__value" side>
          <b>{{entranceData.schoolCertificateBall}}</b>
        </q-item-section>
      </q-item>
      <q-item class="__item" v-if="entranceData.specialNeeds">
        <q-item-section class="__title">Специальные условия ВИ</q-item-section>
        <q-item-section class="__value" side>
          {{entranceData.specialNeeds}}
        </q-item-section>
      </q-item>
    </q-list>

  </div>

</template>

<script>

  export default {
    components: {},
    props: {
      order: {}
    },
    data() {
      return {
        orderData: this.order,
      }
    },
    watch: {
      order(val) {
        this.orderData = val
      }
    },
    computed: {
      entranceData() {
        return this.orderData.anket.entrance
      }
    }
  }
</script>


<style lang="scss" scoped>


</style>
