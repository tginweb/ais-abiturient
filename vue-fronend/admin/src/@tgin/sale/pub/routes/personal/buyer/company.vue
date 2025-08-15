<template>

  <component
      v-bind="pageViewBind"
      :path="pagePathFull"
      :loading="requestState.fetching"
      :loaded="requestState.fetched"
      :title="pageTitle"
  >


    <div class="c-panel q-pa-md" v-if="entity">

      <div class="bg-white q-pa-md">

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

        <div class="q-mt-md q-pt-sm border-t-1 border-primary-brown-1">

          <div class="q-gutter-md">
            <q-btn
                label="Редактировать"
                color="primary"
                outline
                :to="{
                  name: 'sale:buyer.company.edit',
                  params: {
                    entityId: entityId,
                    onResolve: fetch
                  }
               }"
            />
            <q-btn
                label="Скачать договор"
                color="primary"
            />
          </div>

        </div>

      </div>


    </div>

  </component>


</template>

<script>

import MRoute from "@tgin/user/pub/component/profile/route.mixin"

export default {
  mixins: [MRoute],
  components: {},
  props: {
    item: {},
    id: {},
    action: {default: 'edit'},
    onSaved: {},
    context: {},
    canDelete: {default: true},
    entityId: {}
  },
  data() {
    return {
      entity: null,
    }
  },
  computed: {
    pageTitle() {
      return this.entity && this.entity.NAME
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
    pagePath() {

      const path = [
        {
          url: this.$app.getRouteByName('sale:buyer.companies', 'path'),
          label: 'Юр. лица'
        },
      ]

      if (this.entity) {
        path.push({
          label: 'Компания ' + this.entity.NAME
        })
      }

      return path
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

.c-panel {
  background-color: #F8F5F2;
}

</style>
