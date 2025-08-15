<template>

  <div>

    <ul class="q-pl-md q-my-none">
      <li v-for="order of row.abitOrders">
        <span class="s-link cursor-pointer" @click.stop="$router.push('/admin/edu/order/'+order.nid+'/view')">
          <span v-if="order.orderType">{{order.orderType.nameShort}}:</span>
          {{ order.fio }} [{{ order.nid }}]
        </span>
      </li>
    </ul>

  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
}
</script>

<style lang="scss" scoped>


</style>
