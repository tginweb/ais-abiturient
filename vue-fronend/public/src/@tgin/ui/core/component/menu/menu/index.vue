<template>

  <div
      ref="com"
      :class="{
        'com flex no-wrap items-center': true,
        '--font-size-inherit' : fontSizes === 'inherit'
      }"
      v-intersection="onIntersection"
  >

    <q-resize-observer @resize="onResize"/>

    <template v-for="(item, index) of itemsLimited">

      <div
          :id="'menu-item-' + index"
          :key="item.url"
          :ref="'mi-' + index"
          class="item"
          v-if="$scopedSlots['item-wrapper']"
      >
        <slot
            name="item-wrapper"
            v-bind="{item}"
        />
      </div>

      <div
          v-else
          :id="'menu-item-' + index"
          :key="item.url"
          :ref="'mi-'+index"
          :class="itemClass"
          :style="{
            backgroundColor: item.bgColor
          }"
          class="item"
      >

        <span
            class="item__native"
        >

          <slot name="item" v-if="$scopedSlots.item" v-bind="{item}"/>

          <component
              v-else
              :key="index"
              v-bind="item.bind"
              @click="onItemClick(item)"
              @mouseleave="onItemLeave(item)"
              @mouseover="onItemOver(item)"
              :style="{
                backgroundColor: item.bgColor
              }"
          >

            <q-icon
                v-if="maxDepth > 0 && item.children && item.children.length"
                :name="$icons.fasAngleDown"
                class="q-ml-sm"
                size="12px"
            />

          </component>

        </span>

        <div
            v-if="opened && (opened.url === item.url) && item.children && item.children.length"
            class="dropdown --block"
            @mouseleave="onDropdownLeave"
            @mouseover="onDropdownOver(item)"
        >
          <component
              v-if="item.submenuIs"
              :is="item.submenuIs"
              :node="item"
              no-focus
              @close="onDropdownLeave"
          />
          <slot
              :name="'submenu-entity-' + item.entityType"
              v-bind="{node: item}"
              v-else-if="item.entityType && ($slots['submenu-entity-' + item.entityType] || $scopedSlots['submenu-entity-' + item.entityType])"
              @close="onDropdownLeave"
          />
          <slot
              name="submenu"
              v-bind="{node: item}"
              v-else
              @close="onDropdownLeave"
          />
        </div>

      </div>

    </template>

    <q-btn-dropdown
        v-if="dropdownMenu.length"
        class="item__link q-ml-md --wrapper-dense --icon-same"
        :color="moreColor || itemColor"
        dense
        flat
        label="Еще"
    >
      <q-list>

        <q-item
            v-for="(item, index) of dropdownMenu"
            :key="index"
            v-close-popup
            clickable
            @click="onItemClick(item, true, true)"
        >
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-btn-dropdown>

  </div>

</template>

<script>

import NavSubmenu from './submenu'

export default {
  components: {
    NavSubmenu,
  },
  props: {
    value: {},
    maxDepth: {},
    moreDropdown: {},
    menu: {},

    fontSizes: {default: 'inherit'},

    itemIs: {default: 'btn'},
    itemColor: {default: 'primary'},
    itemDense: {default: true},
    itemWrapperDense: {default: false},
    itemLineHeight: {default: false},

    itemFlat: {default: true},
    itemIcon: {default: null},
    itemClass: {default: () => ({})},
    itemLinkClass: {default: () => ({})},
    itemLinkStyle: {default: () => ({})},

    itemIconOnRight: {default: false},
    itemIconHide: {default: false},
    itemIconClass: {default: () => ({})},

    itemActiveBg: {default: null},
    itemActiveColor: {default: 'primary'},

    dropdownIs: {default: 'nav-submenu'},
    moreColor: {default: 'primary'},

    cbItemClick: {default: null},

    activeMoveRoot: {default: false},
    limit: {default: 10},
  },
  data() {
    return {
      valueState: this.value,
      opened: null,
      openedTimeout: null,
      active: null,
      menuLimit: this.limit,
      width: null,
      shown: false
    }
  },
  watch: {
    valueState(v) {
      this.$emit('input', v)
    },
    value(v) {
      this.valueState = v
    }
  },
  computed: {
    onRecalcDebounced() {
      return this.$util.base.debounce(this.menuLimitCalc, 70)
    },

    activeIndex() {
      return this.itemsComp.findIndex(item => !!item.active)
    },

    itemsComp() {
      return this.menu.map(item => {
        const link = this.bindItemLink(item)
        return {
          ...item,
          bind: link,
        }
      })
    },

    itemsLimited() {
      return this.itemsComp.slice(0, this.menuLimit)
    },

    dropdownMenu() {
      return this.itemsComp.slice(this.menuLimit)
    },

  },
  mounted() {
    //  this.onRecalcDebounced();
  },
  methods: {

    onIntersection(entry) {
      if (!this.shown && entry.isIntersecting) {
        this.shown = true
      }
    },

    onResize() {
      this.onRecalcDebounced();
    },

    menuLimitCalc() {

      if (!this.moreDropdown || !this.shown) return;

      this.menuLimit = this.limit

      this.$nextTick(() => {

        if (!this.$refs.com)
          return;

        const maxWidth = this.$refs.com.clientWidth - 60


        let itemsLimit = 0

        this.width = maxWidth

        let usedWidth = 0
        let index = 0

        for (let item of this.itemsLimited) {

          const elmItem = this.$refs['mi-' + index] && this.$refs['mi-' + index][0]

          if (!elmItem) continue;

          usedWidth = usedWidth + elmItem.clientWidth

          if (usedWidth <= maxWidth) {
            itemsLimit++;
          } else {
            break;
          }

          index++
        }

        this.menuLimit = itemsLimit;
      })
    },

    bindItemLinkBase(item, active) {

      return {
        class: this.$util.html.classExtend({
          'item__link': true,
          '--active': active,
          ['bg-' + this.itemActiveBg]: this.itemActiveBg && active
        }, this.itemLinkClass),
        style: this.itemLinkStyle,
        active: active
      }
    },

    bindItemLinkBtn(item) {

      let active

      if (this.opened) {
        active = this.opened.url === item.url
      } else {
        active = (this.valueState && (item.url === this.valueState)) || item.url === this.$route.path
      }

      const res = this.bindItemLinkBase(item, active)

      res.is = item.is || 'q-btn'

      if (!item.native && !item.blank) {
        res.to = item.url
      } else {
        res.type = 'a'
        res.href = item.url
        if (item.blank) {
          res.target = '_blank'
        }
      }

      res.label = item.label

      if (!this.itemIconHide) {

        let icon = typeof item.icon !== 'undefined' ? item.icon : this.itemIcon

        if (icon) {
          icon = this.$icons[icon] || icon
          if (this.itemIconOnRight) {
            res.iconRight = icon
          } else {
            res.icon = icon
          }
        }
      }

      res.flat = typeof item.flat !== 'undefined' ? item.flat : this.itemFlat
      res.dense = typeof item.dense !== 'undefined' ? item.dense : this.itemDense

      res.color = item.color ? item.color : this.itemColor

      if (active) {
        if (this.itemActiveColor) {
          res.color = this.itemActiveColor
        }
      }

      if (this.itemWrapperDense)
        res.class['--wrapper-dense'] = true

      if (this.itemLineHeight)
        res.class['--line-height-' + this.itemLineHeight] = true


      return res
    },

    bindItemLink(item) {

      let res

      /*
        switch (this.itemIs) {
          case 'button':
            res = this.bindItemLinkBtn(item);
            break;
          case 'router-link':
            res = this.bindItemLinkRouterLink(item);
            break;
          default:
            res = this.bindItemLinkBase(item);
            res.is = item.IS || this.itemIs
        }
    */

      res = this.bindItemLinkBtn(item);

      res.class = this.$util.html.classToString(res.class)

      return res
    },

    itemHorverClearTimeout() {
      if (this.openedTimeout) clearTimeout(this.openedTimeout)
    },
    onItemOver(item) {
      this.itemHorverClearTimeout();

      this.openedTimeout = setTimeout(() => {
        this.opened = item
      }, this.opened ? 100 : 100)
    },
    onItemLeave() {
      this.itemHorverClearTimeout();
      this.openedTimeout = setTimeout(() => {
        this.opened = null
      }, 300)
    },
    onItemClick(item, nav, dropdown) {

      this.valueState = item.url

      if (this.cbItemClick) {
        this.cbItemClick(item, nav)
      } else {
        if (item.url) {
          if (nav) {
            this.$router.push(item.url)
          }
          this.onItemClose()
        } else {
          this.itemHorverClearTimeout();
          this.opened = item
        }
      }

      if (dropdown) {
        //this.$nextTick(() => {this.menuLimitCalc()})
      }
    },
    onItemClose() {
      this.itemHorverClearTimeout();
      this.opened = null
    },
    onDropdownLeave() {
      this.openedTimeout = setTimeout(() => {
        this.opened = null
      }, 150)
    },
    onDropdownOver(item) {
      this.itemHorverClearTimeout();
      this.opened = item
    },
  },

}
</script>

<style lang="scss" scoped>

.com {
  &.--font-size-inherit {
    .q-btn,
    .q-tab__label {
      font-size: inherit !important;
    }
  }
}

.item {
  display: inline-block
}

.item__native {
  text-decoration: none;
  vertical-align: middle;
}

.item__link {
  border-radius: 0;
  display: inline-block;
  vertical-align: middle;

  &.--active {

  }

  &.--wrapper-dense {
    /deep/ {
      .q-btn__wrapper {
        padding: 0;
      }
    }
  }

  &.--line-height-none {
    /deep/ {
      .block {
        line-height: 1;
      }
    }
  }

  /deep/ {
    .q-focus-helper {
      display: none;
    }

    .q-btn__wrapper {
      min-height: auto;
    }

  }
}


.dropdown {
  border-radius: 0 0 5px 5px;
  box-shadow: 0 20px 30px rgba(0, 0, 0, .1);
  background: #fff;
  position: absolute;
  left: 0;
  top: 100%;

  background: #fff;
  z-index: 100;

  &.--block {
    width: 100%;
  }
}

.item__icon {
  margin-top: -2px;

}

.item__label {
  white-space: nowrap;
}

.q-btn {
  /deep/ {
    .q-icon {
      font-size: inherit;
    }
  }
}


</style>
