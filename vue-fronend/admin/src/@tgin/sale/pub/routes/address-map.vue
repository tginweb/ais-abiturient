<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actionsClose="true"
    :loading="fetching"
    :title="pageTitle"
    @hide="onHide"
    dialogWidth="1100px"
  >
    <div class="c-map">

      <ui-progress-inner-loading
        v-model="deliveryCalc.fetching || !inited"
        style="z-index: 100;"
      />

      <yandex-map
          v-if="inited"
          :coords="coords"
          :zoom="10"
          class="c-map__embed"
          @click="onMapClick"
          @map-was-initialized="onMapReady"
      >
        <ymap-marker
            v-for="(item, index) in zones"
            v-if="item.coords"
            :key="index"
            :coords="item.coords"
            :marker-fill="{
              color: item.PROP_GEOJSON.properties.fill,
              opacity: item.PROP_GEOJSON.properties['fill-opacity']
           }"
            :marker-stroke="{
              color: item.PROP_GEOJSON.properties.stroke,
              width: item.PROP_GEOJSON.properties['stroke-width'],
              opacity: item.PROP_GEOJSON.properties['stroke-opacity'],
          }"
            :markerId="'z-' + item.ID"
            marker-type="Polygon"
            @click="onMapClick"
        />

        <ymap-marker
            :coords="coords"
            marker-id="pointer"
            marker-type="placemark"
        >
        </ymap-marker>
      </yandex-map>

    </div>

  </component>

</template>

<script>
import MRoute from "@tgin/main/router/mixin/route-public";
import MVRoute from '@tgin/main/router/mixin/vroute'

let map;

export default {
  mixins: [MRoute, MVRoute],
  components: {

  },
  props: {
    onDone: {},
    orderPrice: {},
    openAddress: {}
  },
  data() {
    return {
      items: null,
      inited: false,
      coords: this.getInputMapProps().center,
      currentGeo: {
        fetching: false,
        address: null
      },

      deliveryCalc: {
        fetching: false
      },
    }
  },
  computed: {

    inputMapProps() {
      return this.getInputMapProps()
    },

    centerComp() {
      return this.inputMapProps.center
    },

    pageTitle() {
      return 'Выбрать адрес'
    },
    zones() {
      return this.$store.getters['sale/deliveryZonesForYandexMap']
    },
    balloonTemplate() {
      return `
        <div class="c-baloon text-center q-pa-sm">
          <div class="c-baloon__address s-font-xs">${this.currentGeo.address}</div>
          <div class="c-baloon__select q-mt-sm">
              <button id="baloon-select-button" class="bg-primary q-px-md q-py-xs text-white s-font-sm">Выбрать</button>
          </div>
        </div>
      `
    }
  },
  methods: {
    getInputMapProps() {
      return this.$store.getters['storeMap']('saleInputMapProps', {})
    },

    hideBalloon() {
      if (map) {
        map.balloon.close();
      }
      this.unbindListener()
    },

    showBalloon() {
      if (map) {
        map.balloon.open(this.coords, this.balloonTemplate);
      }
      setTimeout(() => {
        this.bindListener()
      }, 100)
    },

    bindListener() {
      const button = document.getElementById('baloon-select-button')
      if (button)
        button.addEventListener('click', this.onSelectAddress);
    },
    unbindListener() {
      const button = document.getElementById('baloon-select-button')
      if (button)
        button.removeEventListener('click', this.onSelectAddress);
    },

    async onSelectAddress() {

      this.deliveryCalc.fetching = true

      if (this.currentGeo.address) {
        try {
          const res = await deliveryDispatcher.find(this.currentGeo.address, this.orderPrice)

          if (this.onDone)
            this.onDone(res)

          this.deliveryCalc.fetching = false
          this.unbindListener()

          this.visible = false

        } catch (e) {
          console.log(e)
        }
      }

      this.deliveryCalc.fetching = false

    },

    onMapReady(m) {
      map = m
    },

    onMapClick(e) {
      console.log(e)
      this.coords = e.get('coords');
    },

    async findAddress(coords) {

      this.hideBalloon();

      const geoObject = await this.$store.dispatch('geo/findObject', {
        type: 'coordinates',
        lat: coords[1],
        lng: coords[0],
      })

      if (geoObject && geoObject.address && geoObject.kind === 'house') {
        this.currentGeo.address = geoObject.address
        this.showBalloon();
      }
    },

  },
  async created() {
    await this.$store.dispatch('sale/ensureDeliveryZones')

    if (this.openAddress) {
      const object = await this.$store.dispatch('geo/findObject', {
        type: 'address',
        address: this.openAddress,
      })
      if (object.coordinates) {
        this.coords = [object.coordinates.lat, object.coordinates.lng]
      }
    }
    this.inited = true
  },
  watch: {
    coords() {
      //if (!this.inited) return
      this.findAddress(this.coords)
    }
  }
}
</script>
<style lang="scss" scoped>


.c-map {
  height: 75vh;

  .c-map__embed {
    height: 100%;
  }

  /deep/ {
    .c-baloon {
      max-width: 200px;

      #baloon-select-button {
        border: 0;
      }
    }
  }
}


</style>
