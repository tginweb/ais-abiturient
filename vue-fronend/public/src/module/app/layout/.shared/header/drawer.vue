<template>

  <div ref="com" class="com s-font-xs">

    <div class="container">

      <div class="row q-col-gutter-x-lg q-my-md">

        <div
          v-for="(items, index) of menuItemsSplitted"
          :key="index"
          class="col-24 col-sm-12"
        >
          <q-list
            class="c-menu q-py-none"
            dense
            padding
          >
            <q-item
              v-for="item of items"
              :key="item.URL"
              v-ripple
              :to="item.URL"
              class="c-menu__item "
              clickable
              manual-focus
              exact
            >
              <q-item-section>
                {{ item.NAME }}
              </q-item-section>
            </q-item>

          </q-list>

        </div>

      </div>

      <div class="q-mb-lg">

        <div class="q-mb-sm">Связаться с нами</div>

        <div class="row q-col-gutter-sm">

          <div
            v-for="item of menuBottom"
            :key="item.URL"
            class="col-24 col-md-8"
          >
            <a :href="item.URL" class="text-dark inline-block full-width text-center q-py-sm "
               style="background-color: #EEE;">

              <q-icon
                v-if="item.ICON"
                :name="item.ICON"
                class="q-mr-sm"
              />

              <span>{{ item.NAME }}</span>
            </a>
          </div>

        </div>

      </div>

      <div class="row q-col-gutter-sm">

        <div class="col-16">

          <div class="q-mb-sm">
            Социальные сети
          </div>

          <div class="flex q-gutter-x-sm">

            <q-btn
              :icon="$icons[item.ICON]"
              :key="item.URL"
              class="q-pa-sm"
              color="primary-brown-gray-1"
              dense
              size="12px"
              text-color="dark"
              unelevated
              type="a"
              :href="item.URL"
              target="_blank"
              v-for="item of $store.getters['menu/menusItems']['bottom_social']"
            />
          </div>

        </div>

        <div class="col-12" v-if="false">

          <div class="q-mb-sm">
            Моб. приложение
          </div>

          <div class="flex q-gutter-x-sm">
            <q-btn
              :icon="item.icon"
              :key="index"
              class="q-pa-sm"
              color="primary-brown-gray-1"
              dense
              size="12px"
              text-color="dark"
              unelevated
              v-for="(item,index) of menuApps"
            />
          </div>

        </div>

      </div>

    </div>

  </div>

</template>

<script>
export default {
  data() {
    return {

      menuSocials: [
        {title: '', url: 'sdsdd', icon: this.$icons.fabVk},
        {title: '', url: 'sdsdd', icon: this.$icons.fabInstagram},
        {title: '', url: 'sdsdd', icon: this.$icons.fabFacebook},
      ],

      menuApps: [
        {title: '', url: 'sdsdd', icon: this.$icons.fabVk},
        {title: '', url: 'sdsdd', icon: this.$icons.fabInstagram},
      ],

      menuBottom: [
        {
          NAME: 'WhatsApp',
          URL: 'whatsapp://send?text=MESSAGE&phone=+79117758500&abid=+NUMERO',
          NATIVE: true,
          ICON: this.$icons.fabWhatsapp
        },
        {
          NAME: '+7 911 775-85-00',
          URL: 'tel://+79117758500',
          NATIVE: true,
        },
        {
          NAME: 'info@gryadkaspb.ru',
          URL: 'mailto:info@gryadkaspb.ru',
          NATIVE: true
        },
      ],

    }
  },
  methods: {

    chunkArray(arr, n) {
      var chunkLength = Math.max(arr.length / n, 1);
      var chunks = [];
      for (var i = 0; i < n; i++) {
        if (chunkLength * (i + 1) <= arr.length) chunks.push(arr.slice(chunkLength * i, chunkLength * (i + 1)));
      }
      return chunks;
    }
  },
  computed: {

    menuItemsSplitted() {
      const parts = this.chunkArray(this.$store.getters['menu/menusItems'].top, 2)

      parts[0].unshift({
        URL: '/',
        NAME: 'Главная'
      })

      parts[0].unshift({
        URL: '/Catalog/',
        NAME: 'Каталог товаров'
      })

      return parts
    }
  }
}
</script>

<style lang="scss" scoped>

.c-menu__item {
  padding: 8px 0 8px 0;
  font-weight: bold;
}

</style>
