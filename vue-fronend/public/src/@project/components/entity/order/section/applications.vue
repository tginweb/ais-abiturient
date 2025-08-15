<template>

  <div class="com s-info-section">

    <div class="__header">Выбранные направления</div>

    <q-markup-table
        v-if="applicationsData.length>0"
        class="c-applications s-table-data"
        flat
    >
      <tbody>

      <tr
          v-for="(item, index) in applicationsData"
          class="__item"
      >

        <td class="dense" style="width: 30px;">
          {{ index + 1 }}.
        </td>

        <td class="__item__name" style="width: 65%">

          <div>

            {{ item.admission.direct_name }}

            {{ item.admission.abbr }}

          </div>

          <div class="text-weight-bold">
            {{ item.admission.fob.name }}
          </div>

          <div class="text-grey-8">
            {{ item.source.name }}
          </div>

          <div v-if="item.specsAdmissions && item.specsAdmissions.length" class="q-mt-xs text-grey-7">

            <ul style="" class="q-pl-md q-my-sm">
              <li
                  v-for="specsAdmission of item.specsAdmissions"
                  :key="specsAdmission.id"
              >
                {{ specsAdmission.abbr }}
                {{ specsAdmission.spec_name }}
              </li>
            </ul>

          </div>

          <div class="q-mt-xs text-grey-8" v-if="item.cappsource === 'epgu'">
              Подано через: ГосУслуги
              <img v-if class="q-my-auto" src="https://gu-st.ru/st/img/logo_nobeta-0a1f5dfe6b.svg" width="70px"/>
          </div>

        </td>

        <td class="__item__status">

          <span v-if="item.agree"><q-icon name="far fa-check-circle" color="green"/> согласие на зачисление</span>
          <span v-else-if="item.agreeDeny"><q-icon name="fas fa-ban" color="red"/> отказ от зачисления</span>

        </td>

      </tr>

      </tbody>

    </q-markup-table>
    <div v-else class="text-grey-7">
      направления не выбраны
    </div>

  </div>


</template>

<script>

export default {
  components: {},
  props: {
    order: {},
    mode: {default: 'full'}
  },
  data() {
    return {
      orderData: this.order,
    }
  },
  methods: {},
  watch: {
    order(val) {
      this.orderData = val
    }
  },
  computed: {
    applicationsData() {
      return this.orderData.applications.items.filter(item => !item.deleted)
    }
  }
}
</script>


<style lang="scss" scoped>


</style>
