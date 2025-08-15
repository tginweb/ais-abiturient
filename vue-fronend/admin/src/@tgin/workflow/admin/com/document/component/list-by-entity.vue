<template>

  <div>

    <q-markup-table
      class="s-table-data"
      flat
    >
      <thead>
        <tr class="text-left">
          <th>ID</th>
          <th>Наименование</th>
          <th>Открыть</th>
        </tr>
      </thead>
      <tbody>
      <tr
        class="__item"
        v-for="item in items"
      >
        <td class="">
          {{ item.ID }}
        </td>
        <td class="">
          {{ item.NAME }}
        </td>
        <td class="">

          <q-btn
            label="открыть"
            dense
            color="primary"
            :to="$entity.getUrl('workflow.document', item, null, 'admin')"
          />

        </td>
      </tr>
      </tbody>
    </q-markup-table>
  </div>

</template>

<script>


export default {
  components: {},
  props: {
    value: {
      default: () => []
    },
  },
  data() {
    return {}
  },
  computed: {

      items() {
        return this.value.map((item)=>{
          const res = {
            ...item
          }



          return res
        })
      }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>


</style>
