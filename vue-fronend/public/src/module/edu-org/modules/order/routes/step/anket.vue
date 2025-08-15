<template>
  <q-page class="">
    <c-wrapper :step="step">
      <c-inner
        :order="$store.getters['edu_order/userOrder']"
      />
    </c-wrapper>
  </q-page>
</template>

<script>

  import CInner from '../../component/entity/page/step/anket'
  import CWrapper from '../../component/entity/page/step/wrapper'

  export default {
    components: {
      CWrapper,
      CInner
    },
    data() {
      return {
        step: 'anket'
      }
    },

  }

</script>
