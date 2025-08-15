<template>
  <q-page class="q-pa-md q-pa-md-xl">
    <el-page-header title="Вступительные испытания"></el-page-header>
    <CWrapper :step="step">
      <CInner
        :order="$store.getters['edu_order/userOrder']"
      ></CInner>
    </CWrapper>
  </q-page>
</template>

<script>
import CInner from '../../component/entity/page/step/entrance'
import CWrapper from '../../component/entity/page/step/wrapper'

export default {
  components: {
    CWrapper,
    CInner
  },
  data() {
    return {
      step: 'entrance'
    }
  },

  async mounted() {
    await this.$store.dispatch('edu_order/userOrderEnsureRequired')
  }
}

</script>
