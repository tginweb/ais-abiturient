<template>

  <div>


    <q-toolbar class="c-header bg-secondary text-white  shadow-2 q-mb-xs" dark style="min-height: 40px;">

      <div>
        Список
      </div>

      <div class="q-gutter-md">

      </div>

      <q-space/>

      <div class="q-gutter-md">

        <q-btn
          dense
          flat
          icon="fas fa-sync-alt"
          size="md"
          @click="reload"
        >
        </q-btn>

        <q-btn
          :label="drawerFilters ? '' : ''"
          color="white"
          dense
          flat
          icon="fas fa-filter"
          size="md"
          @click="drawerFilters = !drawerFilters"
        >
        </q-btn>

        <q-btn
          v-if="filterExist"
          dense
          flat
          icon="fas fa-trash"
          label="Сбросить фильтры"
          size="md"
          @click="filter = $util.base.cloneDeep(filterDefault)"
        />

        <q-btn
          color="white"
          dense
          flat
          icon="fas fa-columns"
          size="md"
        >
          <q-menu auto-close>
            <q-list>
              <q-item
                v-for="(column, index) of columns"
                :key="index"
                clickable
              >
                <q-item-section>
                  <q-checkbox v-model="columnsVisible" :label="column.label" :val="column.name"/>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn
          color="white"
          dense
          flat
          size="md"
        >
          <span class="">{{ viewmodeInfo.label }}</span>

          <q-icon name="arrow_drop_down" size="16px"/>

          <q-menu auto-close fit>
            <q-list>
              <q-item
                v-for="item of viewmodes"
                v-if="viewmode !== item.id"
                :key="item.id"
                v-close-popup
                clickable
                @click="viewmode = item.id"
              >
                <q-item-section>
                  <q-item-label>
                    {{ item.label }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>

        </q-btn>

      </div>


    </q-toolbar>

    <q-splitter
      v-model="splitterFilter"
      :limits="[0, 100]"
      class="c-layout"
      separator-class="bg-grey-2"
      style="height: calc(100vh - 100px);"
    >

      <template v-if="drawerFilters" v-slot:before>


        <div class="q-py-sm q-px-md">

          <div class="q-mb-sm text-weight-bold">
            Фильтры
          </div>

          <q-scroll-area
            v-if="drawerFilters"
            class="bg-white"
            style="height: calc(100vh - 180px);"
            visible
          >

            <ui-filters-tree
              v-model="filter"
              :expanded="filtersExpanded"
              :filters="filters"
            />

          </q-scroll-area>

        </div>


      </template>

      <template v-slot:after>


        <q-table
          :columns="columnsComp"
          :data="dataNodes"
          :loading="$apollo.loading"
          :pagination.sync="pagination"
          :rows-per-page-options="[]"
          :selected.sync="selected"
          :table-style="{
                    maxHeight:  `calc( 100vh - 150px )`,
                    minHeight:  `calc( 100vh - 150px )`,
                }"
          class="c-table s-sticky-header-table s-admin-table"
          row-key="ID"
          selection="single"
          @request="onOrdersRequest"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.labelShort || col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr
              :props="props"
              @click="onRowClick(props)"
              @dblclick="onRowDblClick(props)"
            >
              <q-td v-for="col in props.cols" :key="col.name">
                <component
                  :is="col.com"
                  v-if="col.com"
                  v-bind="col.props || {}"
                  :row="props.row"
                  @actionSubmitted="onActionSubmitted"
                ></component>
              </q-td>
            </q-tr>
          </template>

        </q-table>

        <q-inner-loading :showing="!data || $apollo.loading">
          <q-spinner-gears color="primary" size="50px"/>
        </q-inner-loading>

      </template>

    </q-splitter>


  </div>

</template>

<script>

import {dom, QBadge, QCheckbox, QInput, QRadio} from 'quasar'
import * as cells from '../cell'
import * as orderFilters from '../filters'
import MListable from '@common/core/mixin/listable'
import COrderView from '../view/view'

const {style} = dom

const filtersDefaults = {
  'ID': {eq: ''},
  'PROP_EMAIL': {eq: ''},
  'PROP_PHONE': {eq: ''},
  'PROP_FIO': {like: ''},
}

export default {
  components: {
    ...cells,
    QInput,
    QCheckbox,
    QRadio,
    QBadge,
    COrderView
  },
  mixins: [
    MListable
  ],
  props: {
    query: {},
    filtersNames: {},
    filtersExpanded: {},
    orderId: {},
    path: {},
    mode: {}
  },
  apollo: {
    data: {
      query() {
        return this.query
      },
      deep: true,
      skip: true,
      fetchPolicy: 'no-cache',
      variables() {
        return {
          mode: this.mode,
          where: this.cfilter,
          nav: this.nav,
        }
      },
      update(data) {
        this.total = data.res && data.res.info.total
        return data.res
      },
      notifyOnNetworkStatusChange: true
    }
  },
  data() {
    return {
      skip: true,
      orderIdData: this.orderId,
      drawerFilters: true,
      viewmode: this.$q.screen.gt.lg ? 'right' : 'dialog',
      viewmodes: [
        {id: 'right', label: 'Просмотр справа', icon: '', splitterWidth: 53},
        {id: 'dialog', label: 'Просмотр в окне', icon: '', splitterWidth: 100},
      ],
      filterDefault: filtersDefaults,
      splitterFilter: 17,
      splitter: 65,

      run: false,

      dialogs: {
        order: {
          visible: false
        }
      },

      nav: {
        sort: 'ID',
        asc: false,
        page: 1,
        limit: 30,
      },

      columnsVisible: [
        'ID',
        'NAME',
        'PHONE',
        'PRICE',
        'IS_PAID',
        'STATUS',
        'OPS'
      ],
      columns: [
        {
          name: 'ID',
          label: 'ID',
          sortable: true,
          com: 'COrderCell_Id'
        },
        {
          name: 'USER',
          label: 'User',
          sortable: true,
          com: 'COrderCell_User'
        },
        {
          name: 'NAME',
          label: 'Имя',
          sortable: true,
          com: 'COrderCell_Name'
        },
        {
          name: 'EMAIL',
          label: 'Email',
          sortable: true,
          com: 'COrderCell_Email'
        },
        {
          name: 'PHONE',
          label: 'Телефон',
          sortable: true,
          com: 'COrderCell_Phone'
        },
        {
          name: 'PRICE',
          label: 'Сумма',
          sortable: true,
          com: 'COrderCell_Price'
        },
        {
          name: 'IS_PAID',
          label: 'Оплачен',
          sortable: true,
          com: 'COrderCell_IsPaid'
        },
        {
          name: 'STATUS',
          label: 'Статус',
          sortable: true,
          com: 'COrderCell_Status'
        },
        {
          name: 'OPS',
          label: 'Операции',
          labelShort: 'ОП',
          com: 'COrderCell_Ops',
          props: {
            entityModule: 'saleAdmin',
            entityType: 'order',
            label: '',
            outlined: true,
            flat: true,
            icon: 'fas fa-bars',
            dense: true,
            style: {
              fontSize: '11px',
              color: '#888'
            }
          }
        },
      ],
      filters: this.loadFilters(orderFilters, this.filtersNames)
    }
  },

  mounted() {

    this.filter = this.$util.base.cloneDeep(this.filterDefault)

    setTimeout(() => {
      this.$apollo.queries.data.skip = false
    }, 1000)
  },
  computed: {

    dataNodes() {
      return this.data && this.data.nodes.map(node => {

        const propsByCode = node.PROPS.reduce((map, prop) => (map[prop.CODE] = prop, map), {});

        return {
          ...node,
          PROPS_BY_CODE: propsByCode
        }
      }) || []
    },

    bindSplitter() {
      let res = {style: {}}

      switch (this.viewmode) {
        case 'right':
          res.horizontal = false
          res.separatorStyle = 'width: 10px'
          res.style.height = 'calc(100vh - 50px)';
          break;
        case 'bottom':
          res.horizontal = true
          res.separatorStyle = 'width: 100%; height: 10px'
          res.style.height = 'calc(100vh - 100px)';
          break;
        case 'dialog':
          res.horizontal = false
          res.separatorStyle = 'width: 10px'
          res.style.height = 'calc(100vh - 100px)';
          break;
      }

      return res;
    },

    viewFrameHeight() {
      switch (this.viewmode) {
        case 'right':
          return '100vh - 200px';
        case 'bottom':
          return (100 - this.splitter) + 'vh - 78px';
        case 'dialog':
          return (100 - this.splitter) + 'vh - 78px';
      }
    },

    bindViewScrollarea() {
      let res = {style: {}}

      switch (this.viewmode) {
        case 'bottom':
          res.style.height = 'calc(' + (100 - this.splitter) + 'vh - 78px)';
          break;
        case 'right':
          res.style.height = 'calc(100vh - 120px)';
          break;
      }

      return res;
    },

    viewmodeInfo() {
      return this.viewmodes.find(item => item.id === this.viewmode)
    },
    columnsComp() {
      return this.columnsVisible.length ? this.columns.filter(col => !!this.columnsVisible.find(visName => col.name === visName)) : this.columns
    },
  },
  watch: {

    viewmodeInfo(info) {
      this.splitter = info.splitterWidth
    },

    orderId(val) {
      this.orderIdData = val
    },

    selectedRow(row) {

      if (row)
        this.listNavRow(row)
    },

    drawerFilters(val) {
      this.splitterFilter = val ? 17 : 0;
    },

    columnsVisible: {
      handler: function (val) {
        this.$ls.set('columnsVisible', JSON.stringify(val))
      },
      deep: true
    },
  },
  methods: {

    async onActionSubmitted() {

      this.reload();
    },

    loadFilters(filters, names) {
      return names.map(filterName => {
        let filterInfo = typeof filters[filterName] === 'function' ? filters[filterName](this.$store) : filters[filterName]
        return filterInfo
      })
    },

    onRowDblClick(props) {
      this.dialogs.order.visible = true
    },

    async onOrdersRequest(props) {
      let pagination = props ? props.pagination : this.pagination;
      let nav = this.tablePaginationToNav(pagination)
      this.nav.page = nav.page
      this.nav.sort = pagination.sortBy
    },

    reload() {
      this.listReload();
      this.viewReload();
    },

    listReload() {
      this.$apollo.queries.data.refetch()
    },

    listNavRow(row) {
      this.$router.push(this.path + row.ID).catch(err => {
      })
    },

    viewReload() {
      this.$refs.view.reload()
      if (this.$refs.viewDialog) this.$refs.viewDialog.reload();
    },

    onViewDelete() {
      this.$router.push(this.path).catch(err => {
      })
    },

    onViewUpdated() {
      setTimeout(() => {
        this.listReload()
      }, 1000)
    },


  }
}
</script>

<style lang="scss" scoped>

.c-header {
  /deep/ .q-icon {
    font-size: 18px;
  }
}

.c-table {

  margin: 0 !important;
  padding: 0;
  border: 0;
  box-shadow: none;
  border-radius: 0;

  /deep/ {


    thead tr {
      background-color: #eee;
      color: #FFF;
      height: auto;

    }

    td, th {
      font-size: 15px;
      text-align: left;
      white-space: normal !important;
      vertical-align: top;
    }

    td {
      padding: 12px 9px;
    }

    th {
      position: sticky;
      z-index: 10;
      top: 0;

      padding: 7px 9px;
      color: #111;

      .q-table__sort-icon {
        position: absolute;
        right: -2px;
      }
    }
  }
}


</style>
