<template>

  <component
      v-model="visible"
      :loaded="fetched"
      :loading="fetching"
      title="Добавить направления"
      dialogWidth="750px"
      v-bind="bindRouterWrapper"
      @hide="onHide"
      @before-hide="onBeforeHide"
  >
    <template v-slot:default>

      <div class="c-filters ">

        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-24 col-sm-12 col-md-6">
            <q-select
                v-model="filters.eduLevel"
                :options="contextEduLevels"
                clearable
                dense
                emit-value
                label="Уровень"
                map-options
                option-label="name"
                option-value="id"
                outlined
            ></q-select>
          </div>
          <div class="col-24 col-sm-12 col-md-6">
            <q-select
                v-model="filters.eduForm"
                :options="contextEduFobs"
                clearable
                dense
                emit-value
                label="Форма"
                map-options
                option-label="name"
                option-value="id"
                outlined
            ></q-select>
          </div>
          <div class="col-24 col-sm-12 col-md-6">
            <q-select
                v-model="filters.eduInstitute"
                :options="contextEduInstitutes"
                clearable
                dense
                emit-value
                label="Факультет"
                map-options
                option-label="name"
                option-value="id"
                outlined
            ></q-select>
          </div>
          <div class="col-24 col-sm-12 col-md-6">
            <q-input
                v-model="filters.name"
                clearable
                dense
                label="Наименование"
                outlined
            ></q-input>
          </div>
        </div>

      </div>

      <div class="q-mt-md">

        <q-btn
            class="q-mr-md"
            color="primary"
            dense
            flat
            outline
            size="14px"
            @click="$refs.tree.expandAll()"
        >
          <q-icon class="q-mr-xs" name="fas fa-plus" size="13px"/>
          развернуть все
        </q-btn>

        <q-btn
            class="q-mr-md"
            color="primary"
            dense
            flat
            outline
            size="14px"
            @click="$refs.tree.collapseAll()"
        >
          <q-icon class="q-mr-xs" name="fas fa-minus" size="13px"/>
          свернуть все
        </q-btn>

      </div>

      <div style1="height: calc(100vh - 200px);" visible>


        <q-tree
            v-if="eduProgramsNodes.length"
            ref="tree"
            :default-expand-all="tree.expanded"
            :nodes="eduProgramsNodes"
            class="c-tree"
            label-key="name"
            node-key="nodeKey"
        >
          <template v-slot:default-header="prop">

            <div
                v-if="prop.node.type === 'eduDir'"
                class="items-center no-wrap full-width"

            >
              <span class="text-weight-bold1 text-grey-8">{{ prop.node.cod }}</span>&nbsp;
              <span class="text-weight-bold1 text-grey-8 ">{{ prop.node.name }}</span>

            </div>
            <div
                v-else-if="prop.node.type === 'compet'"
                class="items-center no-wrap full-width"
            >

              <div class="flex items-center q-mb-sm no-wrap">
                <div>
                  {{ prop.node.name }} (мест {{prop.node.admissionNumberTotal}})
                </div>
                <div class="q-ml-auto">
                  <q-btn @click="onCompetitionAdd(prop.node)" color="primary" label="добавить" outline size="14px"/>
                </div>
              </div>

            </div>

            <div
                v-else
                class="full-width q-my-xs11 cursor-pointer"
            >
              <div class="header-inner">

                <div class="q-mr-md ">
                    <span class="text-weight-bold">
                      {{ prop.node.abbr }} {{ prop.node.direct_name }}
                    </span>
                </div>

                <div v-if="prop.node.spec_name && (prop.node.direct_name.trim()!=prop.node.spec_name.trim())"
                     class="text-grey-8">
                  {{ prop.node.spec_name }}
                </div>

                <div class="text-grey-8" style="text-decoration: underline;">
                  {{ prop.node.level.name_ak }}, {{ prop.node.fob.name }}
                </div>

              </div>

            </div>

          </template>

        </q-tree>

      </div>


    </template>
  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVroute],
  apollo: {
    admissions: {
      query: require('../gql/order/query/admissionsAvailable.gql'),
      update: data => data.res,
      variables() {
        return {
          id: this.entityId
        }
      },
    },
  },
  props: {
    filterRoots: {},
    onResolve: {},
    action: {default: 'edit'}
  },
  components: {},
  data() {
    return {
      tab: 'common',
      tabEntities: 'source',
      dialogIs: 'ui-admin-dialog',
      dialog: {},
      filters: {
        eduLevel: null,
        eduInstitute: null,
        eduForm: null,
        name: null
      },
      tree: {
        expanded: false
      },
      model: {
        orderId: null,
        docCategoryId: null,
        docTypeId: null,
        fields: {
          serial: null,
          number: null,
          date: null,
          org: null,
        }
      }
    }
  },
  computed: {
    personal() {
      return this.entity.anket.personal
    },
    actions() {
      return [

      ]
    },

    pageTitle() {
      return 'Выбор направлений'
    },

    contextAdmissions() {

      return this.admissions && this.admissions.filter(item => item.budgCount > 0 || item.comercCount > 0) || []
    },

    contextEduLevels() {
      return Object.values(this.contextAdmissions.reduce((map, obj) => (map[obj.clevel] = obj.level, map), {}))
    },

    contextEduFobs() {
      return Object.values(this.contextAdmissions.reduce((map, obj) => (map[obj.cfob] = obj.fob, map), {}))
    },

    contextEduInstitutes() {
      return Object.values(this.contextAdmissions.reduce((map, obj) => (map[obj.cfac] = obj.fac, map), {}))
    },

    contextAdmissionsFiltered() {

      if (this.filters.name) {
        var regExp = new RegExp(this.filters.name, "ig");
      }

      return this.contextAdmissions.filter((item) => {

        if (this.filters.eduLevel && (item.clevel != parseInt(this.filters.eduLevel)))
          return false

        if (this.filters.eduInstitute && (item.cfac != parseInt(this.filters.eduInstitute)))
          return false

        if (this.filters.eduForm && (item.cfob != parseInt(this.filters.eduForm)))
          return false

        if (this.filters.name && (item.direct_name.search(regExp) === -1))
          return false

        return true
      })
    },

    eduProgramsNodes() {

      let result = {};

      this.contextAdmissionsFiltered.forEach((admission) => {

        let eduDir = admission.direction;

        if (!eduDir) return;

        if (!result[eduDir.id]) {

          result[eduDir.id] = {
            nodeKey: 'dir-' + eduDir.id,
            ...eduDir,
            type: 'eduDir',
            children: [],
            selectable: false
          }
        }

        admission.children = []

        admission.competitionsList.forEach((compet) => {
          admission.children.push({
            ...compet,
            nodeKey: 'compet:' + admission.id + ':' + compet._id,
            type: 'compet',
          })
        })

        result[eduDir.id].children.push({
          ...admission,
          nodeKey: admission.id,
          type: 'adm',
        })

      })

      console.log(result)
      return Object.values(result)
    }

  },
  created() {
    this.fetch()
  },
  methods: {

    onBeforeHide() {
      this.onResolve && this.onResolve()
    },

    async onCompetitionAdd(competition) {

      try {
        const res = await this.$store.dispatch('gql/mutation', {
          mutation: require('../gql/order/mutation/appAdd.gql'),
          variables: {
            id: this.entityId,
            competitionId: competition._id
          }
        })
      } catch (e) {
        console.log(e)
      }
    },
    onSubmit() {

      this.$refs.form.validate().then(async (success) => {

        if (success) {

          try {

            const vars = {}

            vars.model = this.model

            let {data: {res: {result}}} = await this.$apollo.mutate({
              mutation: require('../gql/order/mutation/docAdd.gql'),
              variables: vars
            })

            this.$bus.emit('processMessages', result.messages);

            if (result.success) {
              this.onResolve && this.onResolve()
              this.visible = false
            }

          } catch (e) {
            console.log(e)
          }

        }

      }).catch((e) => {

      })

    },
    async fetch() {
      await this.fetchingMethod(async () => {
        this.entity = this.entityData
        this.model.orderId = this.entity._id
      })
    },

  },
  watch: {
    'model.status'(val) {
      if (val === 'accepted') {
        this.model.setInstitute = true
      } else {
        this.model.setInstitute = false
      }
    }
  }

}

</script>

<style lang="scss" scoped>


</style>
