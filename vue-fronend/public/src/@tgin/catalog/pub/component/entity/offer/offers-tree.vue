<template>
  <div>

    <div
        v-for="prop of skuProps"
        :key="prop.ID"
        class="row q-col-gutter-sm qx-mb-last-none q-mb-sm c-prop"
        :class="{
          ['code-' + prop.CODE]: true
        }"
    >
      <div class="col-24 col-lg-6 c-prop__name">
        <div class="s-font-xs q-mt-xs">{{ prop.NAME }}</div>
      </div>

      <div class="col-24 col-lg-18 ">
        <div class="flex q-gutter-x-xs">
          <div
              v-for="option of prop.OPTIONS"
              :key="option.ID"
              v-if="optionsEnabled[prop.ID] && optionsEnabled[prop.ID][option.ID]"
          >

            <q-btn
                @click="setCurrentByValue(prop.ID, option.ID)"
                :label="option.NAME"
                dense
                flat
                size="12px"
                :style="{
                  backgroundColor: option.BG_COLOR,
                  color: option.TEXT_COLOR,
                }"
                class="c-option --normal --no-minheight"
                :class="{
                  'selected': option.SELECTED
                }"
            />

          </div>
        </div>
      </div>

    </div>

    <div
        v-if="false"
        v-for="offer of offers"
        :key="offer.ID"
        class="row q-mb-md"
    >
      <div>
        {{ offer.NAME }}
      </div>
      <div>
        {{ offer.PROPS }}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {},
  props: {
    entity: {}
  },
  data() {
    return {
      selectedOfferId: this.entity.OFFERS[0].ID
    }
  },
  methods: {
    setCurrentById(offerId) {
      this.selectedOfferId = offerId
    },

    setCurrentByValue(propId, value) {

      let offer = this.selectedOffer
      let result = null;
      let values

      if (offer === null)
        return result

      const selectedOfferValues = this.offersSkuPropsValues[offer.ID]

      values = {...selectedOfferValues}
      values[propId] = value;


      result = this.getOfferByValues(values);

      console.log(result)

      if (result !== null)
        return this.setCurrentById(result.ID);

      values = {};

      for (const prop of this.skuProps) {

        const offerPropVal = selectedOfferValues[prop.ID]

        values[prop.ID] = offerPropVal

        if (prop.ID === propId) {
          values[prop.ID] = value;
          break;
        }
      }

      result = this.getOfferByValues(values);

      if (result !== null)
        return this.setCurrentById(result.ID);

      return result;
    },

    getOfferByValues(values) {

      var result = null;

      this.offers.forEach((offer) => {

        var equal = true;

        const offerValues = this.offersSkuPropsValues[offer.ID]

        Object.values(this.skuProps).forEach((property) => {

          const value = offerValues[property.ID]

          if (value && values[property.ID]) {
            if (value != values[property.ID])
              equal = false;
          }
        })

        if (equal) {
          result = offer;
          return false;
        }
      })

      return result;
    }
  },
  computed: {
    offers() {
      return this.entity.OFFERS
    },
    offersById() {
      return this.offers.reduce((map, obj) => (map[obj.ID] = obj, map), {})
    },
    selectedOffer() {
      return this.offersById[this.selectedOfferId]
    },
    selectedOfferScuPropsValues() {
      return this.offersSkuPropsValues[this.selectedOfferId]
    },
    offersSkuPropsValues() {
      return this.offers.reduce((map, offer) => {
        if (!map[offer.ID])
          map[offer.ID] = {}
        map[offer.ID] = offer.PROPS.filter(prop => !!prop.VAL_ENUM_ID).reduce((map, obj) => (map[obj.ID] = obj.VAL_ENUM_ID, map), {})
        return map
      }, {})
    },

    skuPropsById() {
      return this.skuProps.reduce((map, obj) => (map[obj.ID] = obj, map), {})
    },

    skuProps() {
      const map = {}

      this.offers.forEach((offer) => {

        offer.PROPS.forEach((prop) => {

          const selectedOfferPropValue = this.selectedOfferScuPropsValues[prop.ID]

          if (!prop.VAL_ENUM_ID)
            return;

          if (!map[prop.ID]) {
            map[prop.ID] = {
              ...prop,
              OPTIONS: {}
            }
          }

          if (!map[prop.ID].OPTIONS[prop.VAL_ENUM_ID]) {

            const selected = selectedOfferPropValue === prop.VAL_ENUM_ID


            map[prop.ID].OPTIONS[prop.VAL_ENUM_ID] = {
              ID: prop.VAL_ENUM_ID,
              NAME: prop.VAL,
              SELECTED: selected,
              OFFERS: []
            }

            if (prop.CODE === 'COLOR') {
              const bgColor = prop.VAL_ID
              const textColor = this.$util.html.invertColor(bgColor, true)

              map[prop.ID].OPTIONS[prop.VAL_ENUM_ID].TEXT_COLOR = textColor
              map[prop.ID].OPTIONS[prop.VAL_ENUM_ID].BG_COLOR = bgColor

              map[prop.ID].OPTIONS[prop.VAL_ENUM_ID].COLOR = prop.VAL_ID
              map[prop.ID].OPTIONS[prop.VAL_ENUM_ID].NAME = selected ? prop.VAL : ''
            }
          }

          map[prop.ID].OPTIONS[prop.VAL_ENUM_ID].OFFERS.push(offer.ID)
        })
      })

      return Object.values(map)
    },

    optionsSelected() {

    },

    optionsEnabled() {

      const properties = []

      const currentValues = this.selectedOfferScuPropsValues

      const result = {}

      Object.values(this.skuProps).forEach((property) => {

        const propId = property.ID

        this.offers.forEach((offer) => {

          let compared = true;

          const offerValue = this.offersSkuPropsValues[offer.ID][property.ID]
          const offerValues = this.offersSkuPropsValues[offer.ID]

          if (true) {

            properties.forEach((property) => {
              if (offerValues[property.ID] != currentValues[property.ID]) {
                compared = false;
                return false;
              }
            })

          } else if (properties.length > 0) {
            compared = false;
          }

          if (compared) {

            if (!result[propId])
              result[propId] = {};

            result[propId][offerValue] = offerValue
          }
        })

        properties.push(property);
      });

      return result
    }

  },
  watch: {
    selectedOfferId(v) {
      this.$emit('offer', v)
    }
  }
}
</script>

<style lang="scss" scoped>


.c-prop {
  &.code-COLOR {

    .c-option {
      border: 1px solid #aaa;
      min-width: 20px;
      height: 20px;

      &.selected {
        border: 1px solid #222;
      }
    }
  }
}

.c-prop__name {
  font-weight: bold;
}

.c-option {
  &.selected {
    border: 1px solid #aaa;
  }
}

</style>
