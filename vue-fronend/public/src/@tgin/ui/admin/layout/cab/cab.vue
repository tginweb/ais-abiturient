<template>

  <q-layout view="lHh Lpr lFf">


    <q-drawer
        v-model="drawerOpenedState"
        :breakpoint="700"
        :mini="miniState && !drawerHover"
        :mini-to-overlay="miniState && miniToOverlay"
        :width="215"
        class="c-drawer"
        content-class=" text-white1 column"
        content-style="background-color: #eee;"
        elevated
        show-if-above
        @mouseleave="drawerHover = false"
        @mouseover="drawerHover = true"
    >

      <div class="col-auto" style="background-color1:#888;">

        <div class="q-px-sm q-py-xs text-weight-bold flex no-wrap items-center">
          <q-btn
              aria-label="Menu"
              dense
              flat
              icon="menu"
              size="14px"
              @click="miniState = !miniState"
              label="меню"
          />

        </div>

        <div class="q-px-md q-py-xs text-weight-bold">

          <div class="--on-mini">
            &nbsp;
          </div>

          <div class="--on-full flex items-center no-wrap">

            <div class="s-font-xs q-mr-sm">

              {{ $store.getters['user/nameFull'] }}

            </div>

            <div class="q-ml-auto">
              <q-btn
                  icon="logout"
                  dense
                  flat
                  size="14px"
                  :to="{name: 'user:logout'}"
              />
            </div>

          </div>

        </div>

      </div>

      <div class="col">

        <q-scroll-area class="fit">

          <div class="q-pa-sm">

            <q-tree
                ref="tree"
                :nodes="menuLeft"
                :selected="menuSelected"
                children-key="children"
                class="c-tree"
                label-key="label"
                node-key="id"
                dense
                selected-color="primary"
                :expanded.sync="treeExpanded"
                no-selection-unset

            >
              <template v-slot:default-header="prop">

                <div class="flex no-wrap items-center full-width q-my-xs" @click="onMenuItemClick(prop)">

                  <div v-if="false">
                    <q-icon
                        v-if="prop.node.icon"
                        :name="$icons[prop.node.icon] || prop.node.icon"
                        class="c-menu-node__icon q-mr-sm"
                        color="primary"
                        size="19px"
                    />
                  </div>

                  <div class="c-menu-node__label">{{ prop.node.label }}</div>

                </div>

              </template>

            </q-tree>

          </div>
        </q-scroll-area>
      </div>

    </q-drawer>

    <q-page-container>

      <transition appear mode="out-in" name="fade">
        <slot/>
      </transition>

    </q-page-container>

  </q-layout>

</template>

<script>

export default {
  components: {},
  props: {
    appTitle: {},
    menuLeft: {default: () => []},
  },
  data() {
    return {
      menuSelected: null,
      ss: null,
      miniState: false,
      miniToOverlay: true,
      drawerHover: false,
      treeExpanded: [],
      drawerOpenedState: true
    }
  },
  created() {

    const path = this.$util.base.treeReduce(this.menuLeft, (acc, node, path) => {
      if (node.url && (node.url === this.$route.fullPath)) {
        acc = [...path, node]
      }
      return acc
    }, [])

    if (path.length) {
      this.treeExpanded = path.map((item) => item.id)
      this.menuSelected = path[path.length - 1].id
    }

    this.miniState = !!this.$q.cookies.get('drawer_opened')
  },

  computed: {},
  watch: {
    miniState(v) {
      this.$q.cookies.set('drawer_opened', v ? 1 : '', {path: '/', expires: 30})
    }
  },
  methods: {

    onMenuItemClick(data) {

      let selectedId = data.node.id

      if (data.node.url)
        this.$router.push(data.node.url)

      if (data.node.children && !!data.node.children.length) {
        const expanded = this.$refs.tree.isExpanded(data.node.id)
        this.$refs.tree.setExpanded(data.node.id, true)

        const foundChild = data.node.children.find(item => item.url === data.node.url)
        if (foundChild) {
          selectedId = foundChild.id
        }
      }

      this.menuSelected = selectedId
    },
  }
}
</script>

<style lang="scss" scoped>

.c-drawer {

  /deep/ {
    .q-drawer.q-drawer--mini {

      .c-tree {
        margin-left: -15px;
      }

      .q-tree__arrow {
        visibility: hidden;
      }

      .q-tree__node-collapsible,
      .q-tree__arrow1,
      .--on-full {
        display: none;
      }

      .c-menu-node__label {
        display: none;
      }
    }

    .q-drawer:not(.q-drawer--mini) {
      .--on-mini {
        display: none;
      }
    }
  }


}

.c-tree {
  /deep/ {
    .q-tree__node--selected {
      font-weight: bold;

      .c-menu-node__label {
        color: #222;
      }
    }
  }
}


</style>
