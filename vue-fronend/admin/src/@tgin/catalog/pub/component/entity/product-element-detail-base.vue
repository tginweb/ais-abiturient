<template>
  <div v-bind="bind" class="query-item">


  </div>
</template>

<script>
import CParent from './product-element-card'

export default {
  extends: CParent,

  components: {},
  computed: {

    gallery() {
      const res = [];

      if (this.itemDetailImage)
        res.push(this.itemDetailImage.SRC)

      const prop = this.prop.MORE_PHOTO

      if (prop && prop.FILES && prop.FILES.length) {
        prop.FILES.forEach((obj) => {
          res.push(obj.SRC)
        })
      }

      return res
    },

    descDelivery() {
      return this.propVal.DOSTAVKA
    },

    descTeaser() {
      return this.propVal.DOPOLNITELNO || this.entity.DETAIL_TEXT
    },

    descAbout() {
      return this.propVal.SEO_TEXT
    },

    descSostav() {
      return this.propVal.CHTO_PO_SOSTAVU
    },

    descCook() {
      return this.propVal.KAK_GOTOVIT
    },

  },
  data() {
    return {
      sliderSlide: 0,
      isMounted: false,
      queriesLoading: 0
    }
  },
  methods: {
    onSliderChange(oldSlideIndex, newSlideIndex) {
      this.sliderSlide = newSlideIndex

      this.$refs.sliderImages.goTo(newSlideIndex)
      this.$refs.sliderThumbs.goTo(newSlideIndex)
    },
  },
  mounted() {
    this.isMounted = true
  }
}
</script>

<style lang="scss" scoped>


</style>
