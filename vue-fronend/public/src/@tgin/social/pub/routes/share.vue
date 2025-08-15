<template>

  <component
      v-bind="bindRouterWrapper"
      :title="pageTitle"
      @hide="onHide"
      dialogWidth="500px"
  >

    <div class="q-gutter-md q-mb-md">

      <q-btn
          :icon="$icons.fabVk"
          round
          style="background: #5181b8;color:#fff;"
          size="16px"
      />

      <q-btn
          :icon="$icons.fabOdnoklassniki"
          round
          style="background: #EF7D00;color:#fff;"
          size="16px"
      />

    </div>

    <q-input
        label="Ссылка"
        :value="urlComp"
        outlined
        color="primary"
    />

    <q-btn
        label="Скопировать ссылку"
        color="primary"
        class="q-mt-lg"
    />
    <br><br>

  </component>

</template>

<script>
import MRoute from "@tgin/user/pub/component/profile/route.mixin"
import MVRoute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MRoute, MVRoute],
  components: {},
  props: {
    onSuccess: {},

    url: {},
    title: {},
    desc: {},
    image: {},
  },
  data() {
    return {}
  },
  computed: {
    pageTitle() {
      return 'Поделиться'
    },

    urlComp() {
      let url = this.url
      if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
        return url
      } else {
        let host = window.location.protocol + "//" + window.location.host

        return host + url
      }
    }
  }
}
</script>
<style lang="scss" scoped>


</style>
