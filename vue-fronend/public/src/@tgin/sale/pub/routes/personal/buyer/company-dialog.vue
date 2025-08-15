<template>

  <component
      v-bind="bindRouterWrapper"
      :path="pagePathFull"
      :loading="requestState.fetching"
      :loaded="requestState.fetched"
      :title="pageTitle"
      dialog-width="660px"
      @hide="onHide"
  >

    <template v-slot:default v-if="entity">

      <div class="row q-col-gutter-lg">

        <div class="col-24 col-md-12">

          <ui-data-card
              title="Реквизиты"
              :bordered="false"
              :fields="companyFields"
          />

        </div>

        <div class="col-24 col-md-12">

          <ui-data-card
              title="Адреса"
              :bordered="false"
              :fields="addressFields"
          />

        </div>

      </div>

    </template>

  </component>

</template>

<script>

import MRoute from "@tgin/user/pub/component/profile/route.mixin"
import MVRoute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MRoute, MVRoute],
  components: {},
  props: {
    item: {},
    id: {},
    action: {default: 'edit'},
    onSaved: {},
    context: {},
    canDelete: {default: true}
  },
  data() {
    return {}
  },
  computed: {
    pageTitle() {
      if (this.action === 'create') {
        return 'Новая компания'
      } else {
        return this.entity && this.entity.NAME
      }
    },
    companyFields() {

      const result = []

      result.push({
        label: 'ИНН',
        value: this.entity.VALUES.INN
      })

      result.push({
        label: 'КПП',
        value: this.entity.VALUES.KPP
      })

      result.push({
        label: 'ОГРН',
        value: this.entity.VALUES.OGRN
      })


      return result
    },
    addressFields() {

      const result = []

      result.push({
        label: 'Юр. адрес',
        value: this.entity.VALUES.ADDRESS_JUR
      })

      result.push({
        label: 'Почтовый. адрес',
        value: this.entity.VALUES.ADDRESS_MAIL
      })

      result.push({
        label: 'Фактический адрес',
        value: this.entity.VALUES.ADDRESS
      })

      return result
    },
    actions() {
      const result = [];

      result.push({
        label: 'Изменить',
        color: 'primary',
        textColor: 'white',
        width:  'col-12',
        callback: () => {
          this.$router.push({name: 'sale:buyer.company.edit', params: {entityId: this.entity.ID}})
        }
      })

      result.push({
        label: 'Удалить',
        color: 'primary',
        outline: true,
        width:  'col-12',
        callback: () => {
          setTimeout(() => {
            this.onSave()
          }, 300)
        }
      })

      result.push({
        label: 'Скачать договор',
        color: 'primary',
        outline: true,
        width:  'col-24',
        callback: () => {
          setTimeout(() => {
            this.onSave()
          }, 300)
        }
      })

      return result
    },
  },
  methods: {
    async fetch() {
      try {
        const entity = await this.$store.dispatch('sale_pub/userBuyerCompanyFetch', {
          id: parseInt(this.entityId),
          options: {
            state: this.requestState,
            setFetched: false
          }
        })
        if (entity) {
          this.entity = {
            ...entity,
            VALUES: entity.PROPS && entity.PROPS.reduce((map, obj) => (map[obj.CODE] = obj.VAL, map), {}) || {}
          }
          this.requestState.fetched = true
        }
      } catch (e) {
        console.log(e)
      }
    },
  },
  async created() {
    await this.fetch();
  }
}
</script>
<style lang="scss" scoped>


</style>
