<template>

  <component
      v-bind="bindRouterWrapper"
      :context="{entity}"
      :loaded="requestState.fetched"
      :loading="requestState.fetching"
      :title="'Профиль ' + entityId"
      :toolbar="entity && entity.ACTIONS"
      dialog-width="1150px"
      @hide="onHide"
  >

    <template v-slot:default="{entity}">

      <div class="row q-col-gutter-lg q-mb-lg">
        <div class="col-12">
          <ui-admin-data-card
              title="Профиль"
              :fields="sectionCommonFields"
          />
        </div>
        <div class="col-12">
          <ui-admin-data-card
              title="Профиль"
              :fields="sectionCommonFields"
          />
        </div>
      </div>

      <div class="row q-col-gutter-lg">

        <div
            class="col-md-12 q-gutter-y-lg"
            v-for="(groups, index) of propsGroupsChunks"
            :key="index"
        >
          <ui-admin-data-card
              v-for="group of groups"
              :key="group.ID"
              :title="group.NAME"
              :fields="group.FIELDS"
          />
        </div>

      </div>

    </template>

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVroute],
  props: {
    onResolve: {},
    action: {default: 'view'}
  },
  components: {},
  data() {
    return {
      modeId: 'common',
    }
  },
  computed: {

    propsGroupsChunks() {
      return this.$util.base.chunkArray(this.propsGroups, 2)
    },

    sectionCommonFields() {

      const result = []

      result.push({
        label: 'ID профиля',
        value: this.entity.ID,
      })

      result.push({
        label: 'Наименование',
        value: this.entity.NAME
      })

      if (this.entity.PERSON_TYPE) {
        result.push({
          label: 'Тип профиля',
          value: this.entity.PERSON_TYPE.NAME
        })
      }

      if (this.entity.USER) {
        result.push({
          label: 'Пользователь',
          value: this.entity.USER.NAME_FULL + ' [' + this.entity.USER.ID + ']',
          to: '/admin/user/' + this.entity.USER.ID
        })
      }

      return result
    },

    isJuridical() {
      return this.propsByCode.IS_COMPANY && this.propsByCode.IS_COMPANY.VALUE === 'Y'
    },

    propsByCode() {
      return (this.entity ? this.entity.PROPS : []).reduce((map, obj) => (map[obj.CODE] = obj, map), {})
    },

    propsGroups() {

      return this.$store.state.sale.app.orderPropGroups.map((group) => {

        const fields = (this.propsByGroupId[group.ID] || [])
            .filter(prop => {

              if (!this.isJuridical && /^COMPANY\_/i.test(prop.CODE)) {
                return false
              }

              return !!prop.VALUE_VIEW
            })
            .map(prop => {
              const cprop = {
                label: prop.NAME,
                value: prop.VALUE_VIEW
              }
              return cprop
            })

        return {
          ...group,
          FIELDS: fields
        }
      }).filter(group => group.FIELDS.length)

    },

    propsByGroupId() {
      return this.entity.PROPS.reduce((map, item) => {
        if (!map[item.GROUP_ID])
          map[item.GROUP_ID] = []
        map[item.GROUP_ID].push(item)
        return map
      }, {}) || {}
    },

  },
  created() {
    this.fetch()
  },

  methods: {

    async fetch() {
      try {
        const entity = await this.$store.dispatch('sale_admin/profileFetch', {
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
