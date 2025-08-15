<template>

  <div>

    <div class="s-info-section q-mb-xl">

      <div class="s-font-lg q-mb-sm text-weight-bold">Данные</div>

      <q-list class="__items">
        <q-item class="__item">
          <q-item-section class="__title">Guid</q-item-section>
          <q-item-section class="__value " side>
            {{ order.epgu.guid }}
          </q-item-section>
        </q-item>
      </q-list>

    </div>

  </div>

</template>

<script>
import CParent from "./tab"

export default {
  extends: CParent,
  props: {
    entityInput: {},
  },
  components: {},
  data() {
    return {
      entity: this.entityInput,
      epguDocsSelectAll: false
    }
  },
}

</script>

<style lang="scss" scoped>


</style>
