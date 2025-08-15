<template>

  <ui-dialog
    v-model="visible"
    v-bind="bindRouterWrapper"
    :loading="fetching"
    :title="pageTitle"
    dialogWidth="750px"
    @hide="onHide"
  >

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
            option-label="name_ak"
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
            v-else
            class="full-width q-my-xs11 cursor-pointer"
            @click="onAdmissionOpen(prop.node)"
          >
            <div class="header-inner flex no-wrap items-center">

              <div>

                <div class="">

                  <div class="q-mr-md text-weight-bold text-primary1">
                    {{ prop.node.abbr }} {{ prop.node.direct_name }}
                  </div>

                  <div class="text-grey-8"
                      v-if="prop.node.spec_name && (prop.node.direct_name.trim()!=prop.node.spec_name.trim())">
                    {{prop.node.spec_name}}
                  </div>

                </div>

                <div class=" q-mt-xs">
                  {{ prop.node.level.name_ak }}, {{ prop.node.fob.name }}
                </div>

                <div class="text-grey-7  q-mt-xs s-font-sm flex q-gutter-x-md" style="width1: 150px;">
                  <div v-if="prop.node.budgPlaces > 0">Бюджет: {{ prop.node.budgPlaces }}</div>
                  <div v-if="prop.node.lgotQuota > 0">Квота: {{ prop.node.lgotQuota }}</div>
                  <div v-if="prop.node.celevQuota > 0">Целевые: {{ prop.node.celevQuota }}</div>
                  <div v-if="prop.node.comercCount > 0">Коммерческий: {{ prop.node.comercCount }}</div>
                </div>

              </div>

              <div class="q-ml-auto">
                <q-btn
                  color="primary"
                  dense
                  label="выбрать"
                  outline
                />
              </div>

            </div>

          </div>

        </template>

      </q-tree>

    </div>


  </ui-dialog>

</template>

<script>

import MVRoute from '@common/router/mixin/vroute'
const cloneDeep = require('clone-deep');

export default {
  mixins: [MVRoute],
  components: {},
  apollo: {
    admissions: {
      query: require('~module/edu-org/modules/admission/gql/query/list.gql'),
      update: data => data.res,
      variables () {
        return {
          filter: {
            clevel: {in: this.order.eduLevels}
          }
        }
      },
    },
  },
  props: {
    model: {},
    order: {},
    onSelect: {}
  },

  data() {
    return {
      internalValue: this.value,
      internalData: {
        osnova: null,
        priemCat: 1,
        validation: false,
        specs: []
      },
      proc: false,
      status: '',
      tree: {
        expanded: false
      },
      selected: '',
      filters: {
        eduLevel: null,
        eduInstitute: null,
        eduForm: null,
        name: null
      },
    }
  },
  async created() {

  },
  methods: {
    onAdmissionOpen(item) {
      this.$store.dispatch('router/vrouterNav', {
        is: 'edu-order-admission-view',
        props: {
          model: item,
          onSelect: (competition) => {
            this.onSelect(item, competition)
          }
        }
      })
    },
  },
  watch: {

    value(val) {
      this.internalValue = val
    },

    internalValue(val) {
      this.$emit('input', val)
    },

  },
  computed: {
    pageTitle() {
      return 'Выбор направлений'
    },

    contextAdmissions() {
      return this.admissions && this.admissions.nodes.filter(item => item.budgCount > 0 || item.comercCount > 0) || []
    },

    contextEduLevels() {
      return []
      return Object.values(this.contextAdmissions.reduce((map, obj) => (map[obj.clevel] = obj.clevel, map), {})).map((id) => {
        return this.$store.getters['edu_level/byId'][id]
      })
    },

    contextEduFobs() {
      return []
      return Object.values(this.contextAdmissions.reduce((map, obj) => (map[obj.cfob] = obj.cfob, map), {})).map((id) => {
        return this.$store.getters['edu_fob/byId'][id]
      })
    },

    contextEduInstitutes() {
      return []
      return Object.values(this.contextAdmissions.reduce((map, obj) => (map[obj.cfac] = obj.cfac, map), {})).map((id) => {
        return this.$store.getters['edu_institute/byId'][id]
      })
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

        result[eduDir.id].children.push({
          ...admission,
          nodeKey: admission.id,
        })

      })

      return Object.values(result)
    }
  }
}
</script>
<style lang="scss" scoped>

.c-tree {
  /deep/ {

    .q-tree__node-header {
      padding: 7px 4px 7px 4px;

      &.-node-root {

      }
    }

    .q-tree__node--parent > .q-tree__node-header {
      margin-top: 5px;
      background-color: #EEE;
    }

    .q-tree__node--selected {

      border-radius: 0;

      .header-inner {
        background-color1: #999;
        color1: #FFF;

        font-weight: bold;
      }
    }

    .q-tree__node-body {
      cursor: pointer;
      padding: 0px 0 0px 5px;
    }
  }
}


</style>
