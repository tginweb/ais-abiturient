<template>

  <div class="com" style="position: relative">

    <component
        :is="scroll ? 'q-scroll-area':'div'"
        class="c-scroll"
        v-bind="bindScroll"
        visible
    >
      <q-tree
          v-if="filterSchema && !!filterSchema.length"
          :expanded.sync="expandedState"
          :nodes="filterSchemaState"
          class="c-filter-tree"
          node-key="path"
      >
        <template v-slot:default-header="prop">

          <div
              v-if="prop.node.type !== 'group'"
              class="c-filter-tree-control"
          >

            <div v-if="prop.node.control === 'options' && prop.node.label" class="q-mb-sm">
              {{ prop.node.label }}
            </div>

            <template v-if="typeof valueState[prop.node.path] !== 'undefined'">

              <div
                  @click.stop
                  @keydown.stop
                  @keypress.stop
              >

                <component
                    v-if="prop.node.op"
                    v-model="valueState[prop.node.path][prop.node.op]"
                    :ticked.sync="valueState[prop.node.path][prop.node.op]"
                    :title="prop.node.path"
                    dense
                    outlined

                    style="font-size1: 15px;width:100%;"
                    v-bind="bindControl(prop.node)"
                />

                <component
                    v-else
                    v-model="valueState[prop.node.path]"
                    :title="prop.node.path"
                    dense
                    outlined
                    style="font-size1: 15px;"
                    v-bind="bindControl(prop.node)"
                />
              </div>


            </template>

          </div>

          <div v-else>

            <b v-if="getFilterTreeChildrenFilled(prop.node)">
              {{ prop.node.label }}
            </b>
            <template v-else>
              {{ prop.node.label }}
            </template>

          </div>

        </template>
      </q-tree>

      <slot name="bottom"/>

    </component>

    <q-btn
        :label="'Применить фильтр (' + parseInt((applyTime/1000)) + ')'"
        class="full-width q-mb-md"
        color="primary"
        no-wrap
        style="position: absolute;bottom: 0;left:0;"
        v-if="applyTime>0"
        @click="emitUpdate"
    />

  </div>

</template>

<script>

import {QCheckbox, QInput, QRadio} from 'quasar'

export default {
  props: {
    changed: {default: false},
    filterSchema: {},
    expanded: {default: () => ([])},
    value: {default: () => ({})},
    pathsHidden: {default: () => ([])},
    height: {default: 'calc( 100vh - 100px )'},
    scroll: {default: true},
    maxHeight: {},
    minHeight: {},
    label: {},
  },
  components: {
    QCheckbox,
    QInput,
    QRadio
  },
  data() {
    const valueState = this.getValue(this.filterSchema, this.value, true)

    return {
      changedState: false,
      maxHeightState: this.maxHeight || this.height,
      minHeightState: this.minHeight || this.height,
      valueState: valueState,
      valueInitial: this.value,
      valueStateCompact: null,
      valueStateInitial: null,
      expandedState: this.getExpandedState(this.expanded, this.filterSchema),
      filterSchemaState: this.prepareTree(this.filterSchema),
      applyInterval: null,
      applyTime: 0
    }
  },
  watch: {
    valueChanged(v) {
      this.$emit('update:changed', v)
    },

    height(v) {
      this.maxHeightState = this.maxHeight || this.height
      this.minHeightState = this.minHeight || this.height
    },
    valueState: {
      handler: function (val) {

        if (this.applyInterval) {
          clearInterval(this.applyInterval)
        }

        this.applyTime = 2000

        this.applyInterval = setInterval(() => {
          this.applyTime -= 1000
          if (this.applyTime<=0) {
            this.emitUpdate()
          }
        }, 1000)

      },
      deep: true
    },

    value(val) {
      //  this.valueData = val
    },

    filterSchema(data) {

      this.expandedState = this.getExpandedState(this.expanded, this.filterSchema)

      this.filterSchemaState = this.prepareTree(this.filterSchema)

      this.valueState = this.getValue(this.filterSchema, this.value, true)
      this.valueStateInitial = this.getValue(this.filterSchema, this.value, false)
    }
  },
  methods: {

    emitUpdate() {
      this.valueStateCompact = this.getValue(this.filterSchema, this.valueState, false)
      this.$emit('input', this.valueStateCompact)
      clearInterval(this.applyInterval)
      this.applyTime = 0
    },

    getExpandedState(defaultExpanded, filters) {
      return [...defaultExpanded, ...filters.filter(item => item.expanded).map(item => item.path)]
    },

    prepareTree(filterSchema) {
      return this.$util.base.treeFilter(filterSchema, (node, level) => {
        return !node.path || this.pathsHidden.indexOf(node.path) === -1
      }, 'children')
    },

    bindControl(node) {
      const res = {}

      let label = node.label

      let value = node.op ? this.valueState[node.path][node.op] : this.valueState[node.path]

      switch (node.control) {
        case 'datetime':
          res.is = 'ui-input-date'
          res.time = true
          res.fillMask = false
          break;

        case 'dropdown':
          res.is = 'q-select'
          res.options = node.options
          res.emitValue = true
          res.mapOptions = true
          res.multiple = !!node.multiple
          res.useChips = !!node.useChips
          res.hideDropdownIcon = !!node.useChips
          res.clearable = true
          break;


        case 'select':
          res.is = 'ui-input-select'
          res.behavior = 'dialog'
          res.options = node.options
          res.emitValue = true
          res.mapOptions = true
          res.useChips = !!node.useChips
          res.hideDropdownIcon = !!node.useChips
          res.multiple = !!node.multiple
          res.clearable = true
          break;

        case 'tree':

          res.is = 'q-tree'
          res.nodes = node.options
          res.nodeKey = "value"
          res.defaultExpandAll = false
          res.tickStrategy = "strict"
          res.class = "c-control-tree"

          if (node.multitple || node.multiple) {
            res.type = 'checkbox'
          } else {

          }

          break;

        case 'options':

          res.is = 'q-option-group'

          if (node.multitple || node.multiple) {
            res.type = 'checkbox'
          } else {

          }

          res.options = node.options

          break;

        case 'checkbox':

          res.is = 'q-checkbox'
          res['false-value'] = null

          break

        default:

          switch (node.type) {

            case 'boolean':
              res.is = 'q-toggle'

              res['keep-color'] = true
              res['color'] = 'grey-5'
              res['toggle-indeterminate'] = true
              res['size'] = 'lg'

              if (value === true) {
                label = label + ' - да'
                res['color'] = 'green'
              } else if (value === false) {
                label = label + ' - нет'
                res['color'] = 'red'
              } else {
                label = label
              }

              break
            default:
              res.is = 'q-input'
              break;
          }

          break;
      }

      res.label = label

      return res
    },

    valuePrepare(filterSchema, value) {

    },

    getValue(filterSchema, value, full) {

      const values = {}

      const valuesInput = {
        ...value
      }

      const scanTree = (nodes) => {

        const filters = []

        nodes.forEach((node) => {

          if (node.type !== 'group')
            filters.push(node)

          if (node.children && node.children.length)
            Array.prototype.push.apply(filters, scanTree(node.children))
        })

        return filters
      }

      const filters = scanTree(filterSchema)

      filters.forEach((filter) => {

        let currentValue = null

        if (value[filter.path] !== null) {

          if (filter.op) {

            if (typeof value[filter.path] === 'object') {
              const op = Object.keys(value[filter.path])[0]
              if (op === filter.op) {
                currentValue = value[filter.path][op]
              }
            }

          } else if (typeof value[filter.path] !== 'undefined') {
            currentValue = value[filter.path]
          }

        }

        delete valuesInput[filter.path]

        if (!full && (currentValue === null || currentValue === '' || Array.isArray(currentValue) && !currentValue.length)) {
          return
        }

        if (filter.type === 'number') {
          if (currentValue) {
            if (!Array.isArray(currentValue)) {
              currentValue = parseInt(currentValue)
            } else {
              currentValue = currentValue.map((val) => parseInt(val))
            }
          }
        }

        if (filter.op) {
          if (!currentValue && ['in', 'nin'].indexOf(filter.op) > -1) {
            currentValue = []
          }
        }

        if (filter.op) {
          values[filter.path] = {
            [filter.op]: currentValue
          }
        } else {
          values[filter.path] = currentValue
        }


      })

      return {...values, ...valuesInput}
    },

    getFilterTreeChildrenFilled(node) {
      return false
    },

    onBusDataFilters(data) {
      this.valueState = this.getValue(this.filterSchema, data, true)
    },

    onFilterReset() {
      this.valueState = this.getValue(this.filterSchema, this.valueInitial, true)
      this.valueStateInitial = this.getValue(this.filterSchema, this.valueInitial, false)
    }
  },
  computed: {

    valueChanged() {
      return JSON.stringify(this.valueStateCompact) !== JSON.stringify(this.valueStateInitial)
    },

    bindScroll() {

      const res = {
        style: {}
      }

      if (this.scroll) {
        if (this.height)
          res.style.height = this.height

        if (this.maxHeightState)
          res.style.maxHeight = this.maxHeightState

        if (this.minHeightState)
          res.style.minHeight = this.minHeightState
      }

      return res
    }
  },
  created() {
    this.$bus.on('data.filters.set', this.onBusDataFilters)
  },
  beforeDestroy() {
    this.$bus.off('data.filters.set', this.onBusDataFilters)
  },

};
</script>
<style lang="scss" scoped>


.c-filter-tree-control {
  margin-left: -20px;
  width: 100%;

  /deep/ {
    .q-checkbox {
      align-items: start;
      margin-bottom: 6px;
      white-space1: nowrap;

      .q-checkbox__inner {
        margin-top: 3px;
      }
    }
  }

}

.c-filter-tree {
  margin-top: 50px;
  margin-bottom: 80px;

  /deep/ {
    .q-tree__node-header {
      margin-top: 8px;

      &:before {
        width: 15px;
      }
    }
  }
}

.c-control-tree {

  /deep/ {
    > .q-tree__node--child {
      .q-tree__node-header {
        padding-left: 29px;
      }
    }

  }
}

/deep/ {
  .q-select {
    input {
      display: none;
    }
  }

  .q-chip {
    height: auto;
    padding: 4px;
    .ellipsis {
      white-space: normal;
    }
  }
}

</style>
