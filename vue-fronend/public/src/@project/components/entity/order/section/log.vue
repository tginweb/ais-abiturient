<template>

  <div class="com s-info-section">

    <div class="__header">Журнал изменений</div>

    <q-markup-table class="s-data-table">
      <thead>
        <tr>
          <th>Событие</th>
          <th>Дата</th>
        </tr>
      </thead>
      <tbody>
          <tr v-for="item of orderData.log" :key="item._id">
            <td>{{item.message.title}}</td>
            <td>
              {{$util.date.timestampToFormat($util.date.isoToTimestamp(item.createAt), 'datetime')}}
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
      order: {}
    },
    data() {
      return {
        orderData: this.order,
      }
    },
    methods: {

    },
    watch: {
      order(val) {
        this.orderData = val
      }
    },
  }
</script>


<style lang="scss" scoped>


</style>
