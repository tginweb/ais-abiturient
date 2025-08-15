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

    <q-td v-if="treeMode" auto-width>

      <q-btn
          :icon="props.expand ? 'remove' : 'add'"
          color="accent"
          dense
          round
          size="sm"
          @click="props.expand = !props.expand"
          v-if="!!props.row.children"
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


    <template
        v-for="col in props.cols"
    >
      <slot
          :name="'body-cell-' + col.name"
          v-if="$slots['body-cell-' + col.name] || $scopedSlots['body-cell-' + col.name]"
          v-bind="{col:col, row: props.row, gridActive: gridActive}"
      />

      <q-td
          v-else
          :key="col.name"
          :style="col.style"
          :class="{
            'col-sticky': col.sticky,
            [col.class]: true
          }"
          @click="(rowOpener && col.opener!==false && !col.link || !rowOpener && col.opener===true) && onRowOpen(props.row)"
      >

        <template v-if="col.editable">

          <q-input
              v-model="props.row[col.name]"
              outlined
              dense
              @input="onRowEdit(props)"
          />

        </template>

        <slot
            :name="'body-cell-inner-' + col.name"
            v-else-if="$slots['body-cell-inner-' + col.name] || $scopedSlots['body-cell-inner-' + col.name]"
            v-bind="{col:col, row: props.row, gridActive: gridActive}"
        />

        <component
            :is="typeof col.com === 'function' ? col.com() : col.com"
            v-else-if="col.com"
            v-bind="col.props || {}"
            :row="props.row"
            :onRowOpen="onRowOpen"
            :value="col.value"
        />

        <router-link
            v-else-if="col.link && col.value"
            :to="typeof col.link === 'function' ? col.link(props.row, $util.base.deepGet) : $util.base.deepGet(props.row, col.link)"
            v-html="col.value"
        />

        <div
            v-else
            v-html="col.value"
        />

        <q-btn
            v-if="col.actions"
            class="bg-white"
            label="..."
        >
          <q-menu content-class="c-ops-menu">

            <q-list separator>

              <q-item
                  v-for="(action, index) in rowMenuComp"
                  :key="index"
                  v-close-popup="!action.children"
                  clickable
                  @click="onRowAction(action)"
              >
                <q-item-section v-if="action.icon" avatar class="q-pr-md" style="min-width: auto;">
                  <q-icon :name="action.icon" color="primary"/>
                </q-item-section>
                <q-item-section>
                  {{ action.title || action.name }}
                </q-item-section>

                <q-menu v-if="action.children" anchor="top end" content-class="c-ops-menu" self="top start">

                  <q-list separator>

                    <q-item
                        v-for="(subaction, subindex) in action.children"
                        :key="subindex"
                        v-close-popup
                        clickable
                        @click="onRowAction(subaction)"
                    >
                      <q-item-section v-if="subaction.icon" avatar class="q-pr-md" style="min-width: auto;">
                        <q-icon :name="subaction.icon" color="primary"/>
                      </q-item-section>
                      <q-item-section>
                        {{ subaction.title || action.name }}
                      </q-item-section>

                    </q-item>

                  </q-list>

                </q-menu>

              </q-item>

            </q-list>

          </q-menu>
        </q-btn>

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
    bindRowFn: {},
    modeState: {}
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
