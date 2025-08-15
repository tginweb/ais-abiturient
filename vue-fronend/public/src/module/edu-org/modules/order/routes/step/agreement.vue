<template>
  <q-page class="q-pa-xl">
    <el-page-header title="Отправка в ВУЗ"></el-page-header>
    <CWrapper :step="step">
      <CInner
        :value="$store.getters['edu_order/userOrder']"
      ></CInner>
    </CWrapper>
  </q-page>
</template>

<script>

  import CInner from '../../component/entity/page/step/agreement'
  import CWrapper from '../../component/entity/page/step/wrapper'

  export default {
    components: {
      CWrapper,
      CInner
    },
    data() {
      return {
        step: 'agreement'
      }
    },
  }

</script>
