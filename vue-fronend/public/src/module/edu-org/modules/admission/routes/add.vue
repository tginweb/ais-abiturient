<template>
  <q-page class="">

    <layout-cab-page-header
      title="Добавить"
    />

    <div>

       ADMISSIONS ADD

    </div>

  </q-page>
</template>

<script>

import MVroute from '@tgin/ui/admin/mixin/vroute'

export default {
  mixins: [MVroute],
  components: {},
  apollo: {},
  data() {
    return {
      page: {
        title: 'Наботы'
      },
      orderId: null
    }
  },

  methods: {


  }
}
</script>
<style lang="scss" scoped>


</style>
