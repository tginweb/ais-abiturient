<template>

  <component
      v-bind="bindRouterWrapper"
      :context="{entity}"
      :loaded="requestState.fetched"
      :loading="requestState.fetching"
      :title="'Товар ' + entityId"
      dialog-width="1150px"
      @hide="onHide"
      :tabs="modesTabs"
      :tab.sync="modeId"
      :scroll-height.sync="scrollHeight"
  >

    <template v-slot:default="{entity}">


      <q-tab-panels v-model="modeId" animated>

        <q-tab-panel class="q-px-none" name="common">

          <div class="row q-col-gutter-md">

            <div class="col-12 q-gutter-lg">

              <ui-admin-data-card
                  title="Продукт"
                  :fields="sectionCommonFields"
              />

              <ui-admin-data-card
                  title="Цена"
                  :fields="sectionCatalogFields"
              />

              <ui-admin-data-card
                  title="Кратко"
                  :fields="sectionTeaser"
              >
                <template v-slot:value-image>
                 sss
                </template>
              </ui-admin-data-card>

            </div>

            <div class="col-12 q-gutter-lg">

              <ui-admin-data-card
                  title="Свойства"
                  :fields="sectionPropsFields"
              />

            </div>

          </div>

        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="basket">


        </q-tab-panel>

      </q-tab-panels>

    </template>

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVroute],
  props: {
    onResolve: {},
    action: {default: 'edit'},
    iblock: {},
  },
  components: {},
  data() {
    return {
      modeId: 'common',
      submodeId: '',
    }
  },
  computed: {
    modes() {
      if (!this.entity)
        return []

      return [
        {
          id: 'common',
          label: 'Общее',
          type: 'tab',
          actions: () => {

          }
        },
        {
          id: 'basket',
          label: 'Корзина',
          type: 'tab',
          actions: () => {
            return []
          }
        },
      ]
    },

    sectionPropsFields() {
      let result = []
      result = this.entity.PROPS.map(prop => {

        let val;

        if (prop.FILE) {
          val = '<img src="' + prop.FILE.SRC + '"/>'
        } else if (prop.FILES && prop.FILES.length) {
          val = prop.FILES.map(file => {
            return '<div><img src="' + file.SRC + '"/></div>'
          }).join('')
        } else {
          val = prop.VAL
        }

        return {
          label: prop.NAME,
          value: val,
        }
      })
      return result
    },

    sectionTeaser() {

      const result = []

      result.push({
        label: 'Краткий текст',
        value: this.entity.PREVIEW_TEXT
      })

      result.push({
        label: 'Фото',
        name: 'image',
        value: this.entity.PREVIEW_TEXT
      })

      return result
    },

    sectionCatalogFields() {

      const result = []

      result.push({
        label: 'Цена со скидкой',
        value: this.$util.format.price(this.entity.PRICE.DISCOUNTED, true),
      })

      result.push({
        label: 'Цена',
        value: this.$util.format.price(this.entity.PRICE.PRICE, true),
      })

      return result
    },

    sectionCommonFields() {

      const result = []

      result.push({
        label: 'ID товара',
        value: this.entity.ID,
      })

      result.push({
        label: 'Наименование',
        value: this.entity.NAME
      })

      result.push({
        label: 'Дата создания',
        value: this.$util.date.timestampToFormat(this.entity.DATE_INSERT, 'DD.MM.YYYY HH:mm')
      })

      result.push({
        label: 'Дата изменения',
        value: this.$util.date.timestampToFormat(this.entity.DATE_UPDATE, 'DD.MM.YYYY HH:mm')
      })

      result.push({
        label: 'Активность',
        value: this.entity.ACTIVE ? 'да' : 'нет'
      })

      return result
    },

    actions() {
      const actions = this.mode && this.mode.actions
      return actions && (typeof actions === 'function' ? actions() : actions)
    },

    prop() {
      return this.entity.PROPS && this.entity.PROPS.reduce((map, obj) => (map[obj.CODE] = obj, map), {});
    },

    propVal() {
      return this.entity.PROPS && this.entity.PROPS.reduce((map, obj) => (map[obj.CODE] = obj.VAL, map), {});
    },

  },
  created() {
    this.fetch()
  },

  methods: {
    async fetch() {

      try {
        const entity = await this.$store.dispatch('catalog_admin/productFetch', {
          iblock: parseInt(this.iblock),
          id: this.entityIdState,
          options: {
            state: this.requestState,
            setFetched: false
          }
        })
        this.assignEntity(entity, this.requestState)
      } catch (e) {
        console.log(e)
      }
    },

  },
  watch: {}
}

</script>

<style lang="scss" scoped>


</style>
