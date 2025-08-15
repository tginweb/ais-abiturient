<template>
  <div>

    <div v-if="!loaded">

      загрузка

    </div>
    <template v-else-if="stepState">

      <template v-if="!stepState.access">

        <div class="q-mb-md">
          Внимание! Данные на предыдущих шагах заполнены не полностью или с ошибками. Вернитесь назад чтобы внести
          необходимую информацию.
        </div>

        <ui-alerts
          :messages="[stepState.accessErrors]"
          class="c-messages"
          type="error"
        />

      </template>
      <template v-else>

        <slot
        ></slot>

      </template>

    </template>

  </div>
</template>

<script>

export default {
  props: {
    step: {}
  },
  data() {
    return {
      loaded: false,
    }
  },
  async mounted() {

    await this.$store.dispatch('edu_order/setPageStep', this.step)

    await this.$store.dispatch('edu_order/userOrderFetch')

    this.loaded = true
  },
  beforeDestroy() {
    this.$store.dispatch('edu_order/setPageStep', null)
  },
  computed: {
    stepState() {
      return this.$store.getters['edu_order/userOrderStepsById'][this.step]
    }
  },

}

</script>
<style lang="scss" scoped>

.c-messages {
  max-width: 700px;
}

</style>
