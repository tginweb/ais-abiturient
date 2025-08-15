<template>

  <div>

    <div class="c-layout">

      <slot name="filters" v-bind="{filters:filters, filterWrap, filterControlWrap}"></slot>

    </div>

  </div>

</template>

<script>
  import QueryRegion from './region/base';
  import {Customizable} from './mixins/customizable';

  export default {
    mixins: [Customizable],
    components: {
      QueryRegion,
    },
    props: {
      query: {},
      data: {},
      vars: {},
      filters: {},
      regions: {
        default: () => {
        }
      },
      responsive: {},
      customizer: {},
      grid: {}
    },
    data() {
      return {
        constructorOpened: false,
        self: this,
        internalVars: this.query.dataVars
      }
    },
    computed: {

      filtersByField() {
        return this.filters.reduce(function (acc, cur, i) {
          acc[cur.field] = cur;
          return acc;
        }, {});
      },

      compCustomizerItems() {

      },

      compRegions() {

        // let result = this.$util.base.mergeDeep(this.getTypeRegions(), this.regions);

        let result = this.regions;

        return result;

      },

      itemsByRegion() {

        let regions = this.compRegions;

        let result = {};

        for (let regionId in regions) {

          result[regionId] = this.getRegionItems(regionId)
        }

        return result;
      }
    },
    methods: {

      filterWrap(name) {

        let filter = this.filtersByField[name]

        let res = {
          is: filter.wrapperIs || 'FilterWrapper',
          label: filter.title,
          controlIs: filter.controlIs,
          control: filter.control,
          value: this.internalVars.filter[name],
        }

        return res
      },

      filterControlWrap(name) {

        let filter = this.filtersByField[name]

        let res = {
          is: filter.controlIs,
          control: filter.control || {},
          label: filter.title,
          value: this.internalVars.filter[name],
        }

        return res
      },

      onClick() {

        this.query.setFilter('a', 999)
        this.query.commit()


      },

      getGridBind() {

        let gridInfo = this.$util.base.cloneDeep(this.grid);

        let result = Object.assign({
          class: {},
        }, gridInfo);

        if (this.responsive[this.$mqt] && this.responsive[this.$mqt].grid) {
          this.$util.base.mergeDeep(result, this.responsive[this.$mqt].grid);
        }

        return result;
      },

      getRegionBind(regionId) {

        let regionInfo = this.$util.base.cloneDeep(this.compRegions[regionId]);

        let result = Object.assign({
          class: {},
          regionId: regionId,
          items: this.itemsByRegion[regionId],
          cusomizerItemsCompiled: this.compCustomizerItemsCompiled
        }, regionInfo);

        if (this.responsive[this.$mqt] && this.responsive[this.$mqt].regions[regionId]) {
          this.$util.base.mergeDeep(result, this.responsive[this.$mqt].regions[regionId]);
        }


        return result;
      },

      getRegionItems(regionId) {

        let itemsRange = this.compRegions[regionId].itemsRange;

        if (itemsRange) {

          let [rangeStart, rangeEnd] = itemsRange.split('-')

          if (!rangeEnd) {
            rangeEnd = rangeStart;
          }

          rangeEnd++;

          return this.queryResult.items.slice(rangeStart, rangeEnd);
        }

        return [];
      },

      getTypeRegions() {
        return {
          1: {
            class: {
              'md6': true
            },
            module: {}
          }
        };
      },

      click() {

      }

    },
    mounted() {


    }
  }
</script>

<style lang="scss" scoped>


</style>
