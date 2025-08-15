<template>

  <div @click.stop="onClick" class="cursor-pointer" v-if="row.order">

    <div class="text-weight-bold relative-position">
      {{ row.order.fio }}
    </div>

    <div class="q-mt-xs text-grey-7 text-no-wrap" v-if="row.order.snils">
      СНИЛС: {{ row.order.snils }}
    </div>


  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
  computed: {

  },
  methods: {
    onClick() {
      this.$router.push({name: 'edu.order:view', params: {entityId: this.row.orderNid}})
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
