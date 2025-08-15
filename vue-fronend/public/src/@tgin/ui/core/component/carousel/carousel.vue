<template>

  <div
      :data-slide="tabIndex"
      :style="{
        paddingLeft: spaceComp + 'px',
        paddingRight: spaceComp + 'px',
      }"
      :class="{
        'com': true,
        '--flex': flex,
      }"
  >

    <slick-carousel
        v-if="items && items.length"
        :arrows="arrows"
        :centerMode="centerMode"
        :dots="dots"
        :autoplay="autoplay"
        :autoplaySpeed="autoplaySpeed"
        :adaptiveHeight="adaptiveHeight"
        :infinite="infinite"
        :responsive="responsiveComp"
        :slidesToScroll="slidesToScroll"
        :slidesToShow="slidesToShow"
        :style="{
          marginLeft: (-spaceComp) + 'px',
          marginRight: (-spaceComp) + 'px',
        }"
        :variableWidth="variableWidth"
        centerPadding="0px"
        @beforeChange="imagesSlideChange"
    >
      <slot v-bind="{currentResponsiveSettings, spaceComp}"></slot>

    </slick-carousel>
  </div>


</template>

<script>

import {sizes} from '~src/css/quasar.variables.js'

export default {
  props: {
    items: {},
    responsive: {default: ()=>[]},
    adaptiveHeight: {default:false},
    arrows: {default: true},
    centerMode: {default: false},
    slidesToScroll: {default: 1},
    slidesToShow: {default: 1},
    dots: {default: true},
    autoplay: {default: false},
    autoplaySpeed: {default: 3000},
    infinite: {default: false},
    variableWidth: {default: false},
    flex: {default: false},
    space: {default: 8},
  },
  data() {
    return {
      tab: null,
      isMounted: false,
    }
  },
  methods: {
    setTab(val) {

      let id, item

      if (typeof val === 'object')
        id = val.ID
      else if (typeof val === 'string')
        id = val
      else if (typeof val === 'number')
        id = this.items[val] && this.items[val].ID

      this.tab = id
    },

    imagesSlideChange(oldSlideIndex, newSlideIndex) {
      this.setTab(newSlideIndex)
    }
  },
  computed: {

    spaceComp() {
      return this.currentResponsiveSettings.space || this.space
    },

    currentResponsiveSettings() {
      const item = this.responsive.find(item => {
        if (item.breakpoint) {
          return this.$q.screen.lt[item.breakpoint]
        }
      })

      return item ? item.settings : {}
    },

    currentOffset() {
      return this.currentResponsiveSettings.offset
    },


    tabItem() {
      return this.tab && this.items.find(item => item.ID === this.tab)
    },
    tabIndex() {
      return this.items.indexOf(this.tabItem)
    },
    responsiveComp() {
      return this.responsive && this.responsive.map((item) => {
        return {
          ...item,
          breakpoint: typeof item.breakpoint === 'string' ? sizes[item.breakpoint] : item.breakpoint
        }
      })
    },

  },
  created() {
    this.setTab(this.items[0])
  },
  mounted() {

    this.$nextTick(() => {
      setTimeout(() => {
        this.isMounted = true
      })
    }, 100)
  },
  watch: {
    itemsFirst(item) {
      if (item)
        this.setTab(item)
    },
  }
}
</script>
<style lang="scss" scoped>

.com {

  &.--flex {
    /deep/ {
      .slick-track {
        display: flex;
        align-items: stretch;

        > div {
          min-height: 100%;

          > div {
            height: 100%;
          }
        }
      }
    }
  }
}

</style>
