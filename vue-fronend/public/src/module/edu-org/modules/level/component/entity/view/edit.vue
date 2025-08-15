<template>

  <component
    v-bind="bindRouterWrapper"
    :actions="actions"
    :actionsClose="true"
    v-model="visible"
    title="EDIT"
    @hide="onHide"
  >
    COM: edit<br>
    PROPS: {{ entityId }}<br>
    vrouterType: {{ vrouterType }}<br>
    vrouterIndex: {{ vrouterIndex }}<br>

    <q-btn
      @click="emitEntityEvent('updated', {ddd: 'AAA'})"
      label="EDIT"
    />

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
      entityType: 'sale:order',
      dialog: {
        width: '200px',
        mode: 'dialog'
      }
    }
  },
  computed: {

    actions() {
      return [
        {label: 'Отменить', color: 'primary-brown-1', textColor: 'dark', callback: ()=>{}}
      ]
    }
  },
  methods: {}
}

</script>

<style lang="scss" scoped>


</style>
