<template>


  <q-tr
      :props="props"
      @click="onRowClick(props)"
      @dblclick="onRowDblClick(props)"
      v-bind="bind"
  >
    <q-td
        v-if="actionsColumnEnable"
    >

      <ui-menu-toolbar
          :root-bind="{is: 'q-btn-group', outline: true}"
          root-type="btn-group"
          v-if="actionsMenu"
          :items="actionsMenu"
          :root-dense="true"
          :root-flat="true"
          :callback="onRowAction"
          root-size="12px"
      />

    </q-td>
    <q-td v-if="selectionType && selectionType !== 'none'" style="text-align:center">

      <template v-if="!props.row.children">
        <q-radio
            v-model="radioSelectedRow"
            dense
            :val="props.row"
            class=" text-center"
            v-if="selectionType=='single'"
        />
        <q-checkbox
            v-else
            v-model="props.selected"
            dense
        />
      </template>


    </q-td>

    <template v-for="col in props.cols">

      <q-td
          :style="col.style"
      >
        <div
            v-if="col.field"
            v-html="col.value"
        />
        <component
            :is="typeof col.com === 'function' ? col.com() : col.com"
            v-else-if="col.com"
            v-bind="col.props || {}"
            :row="props.row"
            :value="col.value"
        />
      </q-td>

    </template>

  </q-tr>


</template>

<script>

import {QBadge, QCheckbox, QInput, QRadio} from 'quasar'

const queryString = require('query-string');

export default {
  components: {
    QBadge,
    QCheckbox,
    QInput,
    QRadio
  },

  props: {
    navCallback: {},
    props: {},
    activeField: {},
    idField: {},
    selectionType: {},
    rowExpandedCom: {},
    gridActive: {},
    rowOpener: {},
    onRowOpen: {},
    rowMenuComp: {},
    onRowClick: {},
    onRowDblClick: {},
    onRowEdit: {},
    actionsColumnEnable: {},
    onRowAction: {},
    focusedRowState: {},
    radioSelectedRow: {},
    treeMode: {},
    bindRowFn: {}
  },
  data() {
    return {}
  },
  mounted() {


  },
  created() {

  },
  methods: {
    onClick() {
      // this.$refs.dropdownMenu.toggle()
    }

  },
  computed: {

    actionsMenu() {

      const root = this.actionsRoot

      if (this.actionsDropdown.length) {
        root.push({
          bind: {
            is: 'q-btn-dropdown',
            'auto-close': true,
            rounded: true,
            split: true,
            class: 'q-px-xs',
            icon: 'keyboard_arrow_down'
          },
          children: this.actionsDropdown
        })
      }

      return root
    },

    actions() {
      return this.props.row._actions || []
    },

    actionsRoot() {
      return this.actions.filter(item => !!item.rowRoot).map(item => {
        return {
          ...item,
          label: item.rowLabel,
        }
      })
    },

    actionsDropdown() {
      return this.actions
      //return this.actions.filter(item => !item.rowRoot)
    },

    bind() {

      const res = {
        class: {
          '--focused': this.focusedRowState && (this.focusedRowState === this.props.row || this.focusedRowState[this.idField] === this.props.row[this.idField])
        }
      }

      if (this.props.row[this.activeField] === false) {
        res.class['--deactivated'] = true
      }

      if (this.bindRowFn) {
        this.bindRowFn(res, this.props.row)
      }

      return res
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
