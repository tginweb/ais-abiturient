<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actions="actions"
    :actionsClose="true"
    title="VIEW"
    @hide="onHide"
  >
    COM: view<br>
    PROPS: {{ entityId }}<br>
    vrouterType: {{ vrouterType }}<br>
    vrouterIndex: {{ vrouterIndex }}<br>

    <q-btn
      label="CLOSE"
      @click="visible = false"
    />

    <q-btn
      :to="{path: '/order/edit/99999', query: {vroute: true}}"
    >edit
    </q-btn>

  </component>

</template>

<script>

import MVroute from '@common/router/mixin/vroute'

export default {
  mixins: [MVroute],
  props: {

  },
  components: {},
  data() {
    return {

    }
  },
  computed: {
    actions() {
      return [
        {
          label: 'Отменить', color: 'primary-brown-1', textColor: 'dark', callback: () => {
          }
        }
      ]
    }
  },
  methods: {

  }
}

</script>

<style lang="scss" scoped>


</style>
