<template>

  <q-select
      :options="modes"
      v-model="valueState"
      map-options
      emit-value
      dense
  />

</template>

<script>

export default {
  props: {
    value: {},
  },
  data() {
    return {
      valueState: this.value
    }
  },
  mounted() {


  },
  watch: {
    valueState(v) {
      this.$emit('input', v)
    },
    value(v) {
      this.valueState = v
    }
  },
  computed: {
    modes() {
      return [
        {label: 'Таблица', value: 'table'},
        {label: 'Сводная', value: 'pivot'},
        {label: 'Отчет', value: 'report'},
      ]
    }
  },

}
</script>

<style lang="scss" scoped>


</style>
