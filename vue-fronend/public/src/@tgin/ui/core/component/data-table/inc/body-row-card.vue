<template>


  <div
    class="col-xs-24 col-sm-24 col-md-12 col-lg-8 col-xl-8"
  >
    <q-card>

      <q-card-section class="">

        <div class="q-gutter-sm">

          <div
              v-for="(col, colIndex) in props.cols.filter(col => col.name !== 'desc')"
              :key="col.name"
              :style="col.gridStyle"
              :class="col.gridClass"
          >

            <div
                class="row q-my-md"
                v-if="(col.role==='selection' || col.name==='#selection') && selectionType && selectionType !== 'none' "
            >
              <div
                  class="col-24 "
                  @click="radioSelectedRow = props.row"
              >

                <q-radio
                    v-model="radioSelectedRow"
                    dense
                    :val="props.row"
                    class=" text-center"
                    :label="selectionLabel"
                />

              </div>
            </div>

            <slot
                :name="'grid-cell-' + col.name"
                v-if="$slots['grid-cell-' + col.name] || $scopedSlots['grid-cell-' + col.name]"
                v-bind="{col:col, row: props.row, gridActive: gridActive}"
            />

            <slot
                :name="'body-cell-' + col.name"
                v-else-if="$slots['body-cell-' + col.name] || $scopedSlots['body-cell-' + col.name]"
                v-bind="{col:col, row: props.row, gridActive: gridActive}"
            />

            <component
                :is="typeof col.itemCom === 'function' ? col.itemCom() : col.itemCom"
                v-else-if="col.itemCom"
                v-bind="col.props || {}"
                :row="props.row"
            />

            <div
                class="row"
                v-else
                @click="(rowOpener && col.opener!==false || !rowOpener && col.opener===true) && $emit('row-open', props.row)"
            >

              <div class="col-24 col-sm-auto text-grey-6 q-pr-md">
                {{ col.label }}
              </div>

              <div
                  class="col-24 col-sm-grow q-ml-sm-auto"
                  :class="{
                    'text-right': $q.screen.gt.xs
                  }"
              >

                <component
                    :is="col.com"
                    v-if="col.com"
                    v-bind="col.props || {}"
                    :row="props.row"
                />
                <slot
                    :name="'grid-cell-inner-' + col.name"
                    v-else-if="$slots['grid-cell-inner-' + col.name] || $scopedSlots['grid-cell-inner-' + col.name]"
                    v-bind="{col:col, row: props.row, gridActive: gridActive}"
                />
                <slot
                    :name="'body-cell-inner-' + col.name"
                    v-else-if="$slots['body-cell-inner-' + col.name] || $scopedSlots['body-cell-inner-' + col.name]"
                    v-bind="{col:col, row: props.row, gridActive: gridActive}"
                />
                <router-link
                    v-else-if="col.link"
                    :to="typeof col.link === 'function' ? col.link(props.row, $util.base.deepGet) : $util.base.deepGet(props.row, col.link)"
                    v-html="typeof col.field === 'function' ? col.field(props.row, $util.base.deepGet) : $util.base.deepGet(props.row, col.field)"
                />
                <div
                    v-else
                    v-html="typeof col.field === 'function' ? col.field(props.row, $util.base.deepGet) : $util.base.deepGet(props.row, col.field)"
                />


              </div>
            </div>

          </div>

        </div>

      </q-card-section>

    </q-card>
  </div>


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
    actionsColumnEnable: {},
    selectionLabel: {},
    onRowAction: {},
    focusedRowState: {},
    radioSelectedRow: {},
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
            class: 'q-px-sm',
            icon: 'keyboard_arrow_down'
          },
          children: this.actionsDropdown
        })
      }

      return root
    },

    actions() {
      return  this.props.row._actions || []
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
      return this.actions.filter(item => !item.rowRoot)
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
