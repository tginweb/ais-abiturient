<template>
  <div>

  </div>
</template>

<script>

import MenuItems from './items'

export default {
  components: {
    MenuItems
  },
  props: {
    entityId: {},
    entityIds: {},
    excludeKeys: {
      type: Array,
      default: () => []
    },
    filter: {
      default: null
    },
    currentUrl: {
      default: null
    },
    vertical: {
      default: false
    },
    rootType: {
      default: null
    },
    rootBind: {
      default: () => ({})
    },

    rootActiveClass: {
      default: null
    },

    rootColor: {
      default: 'primary'
    },
    rootTextColor: {
      default: null
    },
    rootSize: {
      default: null
    },
    rootDense: {
      default: false
    },
    rootClass: {
      default: null
    },
    rootFlat: {
      default: false
    },
    rootOutline: {
      default: false
    },
    rootIconClass: {
      default: null
    },

    items: {
      type: Array,
      default: () => ([])
    },
    model: {
      type: Boolean,
      default: true
    },
    appendTo: {
      type: String,
      default: null
    },
    autoZIndex: {
      type: Boolean,
      default: true
    },
    baseZIndex: {
      type: Number,
      default: 0
    },
    exact: {
      type: Boolean,
      default: true
    },

    labelKey: {
      type: String,
      default: 'name'
    },
    urlKey: {
      type: String,
      default: 'url'
    },
    childrenKey: {
      type: String,
      default: 'children'
    },
    callbackKey: {
      type: String,
      default: 'callback'
    },
    iconKey: {
      type: String,
      default: 'icon'
    },
    callback: {},
  },
  data() {
    return {}
  },

  computed: {
    rootBindComp() {

      const res = {
        is: 'div',
        ...this.rootBind
      }

      return res
    },

    itemsBindComp() {

      const res = {}

      res.is = this.rootType === 'btn-group' ? 'q-menu' : 'div'

      return res
    },

    itemsComp() {

      const props = {
        'rootIs': 'is',
        'rootIcon': 'icon',
        'rootLabel': 'label',
        'rootColor': 'color',
        'rootTextColor': 'text-color',
        'rootSize': 'size',
        'rootDense': 'dense',
        'rootFlat': 'flat',
        'rootClass': 'class',
        'rootOutline': 'outline',
      }

      return this.items
          .filter(item => {

            if (this.filter) {
              if (typeof this.filter === 'function') {
                if (!this.filter(item))
                  return false
              } else if (Array.isArray(this.filter)) {
                if (this.filter.indexOf(item.key) === -1)
                  return false
              }
            }

            if (this.excludeKeys && this.excludeKeys.length > 0) {
              if (this.excludeKeys.indexOf(item.key) > -1)
                return false
            }

            return true
          })
          .map(item => {

            const citem = {
              ...item,
              bind: item.bind || {}
            }

            const haveChildren = item.children && item.children.length

            citem.bind = {
              ...item.bind,
            }

            switch (this.rootType) {
              case 'btn-group':
                citem.bind.is = 'q-btn'
                break
              default:
                citem.bind.is = haveChildren ? 'q-btn-dropdown' : 'q-btn'
            }

            for (const [prop, val] of Object.entries(props)) {
              if (!citem.bind[val]) {
                if (item[val])
                  citem.bind[val] = item[val]
                else
                  citem.bind[val] = this[prop]
              }
            }

            const itemUrl = item.command && item.command.path ? item.command.path : item.url

            if (this.currentUrl === itemUrl) {

              citem.bind.class = this.rootActiveClass
            }

            if (citem.bind.icon) {
              citem.bind.icon = this.$icons[citem.bind.icon] ? this.$icons[citem.bind.icon] : citem.bind.icon
            }

            return citem
          })
    },

    itemsCompVert() {

      const props = {
        'rootIs': 'is',
        'rootIcon': 'icon',
        'rootLabel': 'label',
        'rootColor': 'color',
        'rootTextColor': 'text-color',
        'rootSize': 'size',
        'rootDense': 'dense',
        'rootFlat': 'flat',
        'rootOutline': 'outline',
        'rootClass': 'class',
      }

      return this.items
          .filter(item => {
            return true
            //return this.excludeKeys.indexOf(item.key) === -1
          })
          .map(item => {

            const citem = {
              ...item,
              bind: item.bind || {}
            }

            const haveChildren = item.children && item.children.length

            citem.bind = {
              ...item.bind,
            }

            if (item.url) citem.bind.to = item.url

            for (const [prop, val] of Object.entries(props)) {
              if (!citem.bind[val]) {
                if (item[val])
                  citem.bind[val] = item[val]
                else
                  citem.bind[val] = this[prop]
              }
            }

            return citem
          })
    }
  },

  methods: {
    onItemClick(item) {

      if (this.callback) {
        this.callback(item)
      } else {

        this.$command(item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.q-btn {

  /deep/ {
    .q-btn__content {
      flex-wrap: nowrap;
    }
  }
}

</style>
