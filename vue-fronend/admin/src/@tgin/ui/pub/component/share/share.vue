<template>
  <div class="com el-share" :class="{
     's-orientation-horizontal': this.orientation==='horizontal',
     's-orientation-vertical': this.orientation==='vertical',
  }">

    <div class="c-caption q-mg-sm text-grey-8" v-if="caption">
      {{caption}}
    </div>

    <ShareNetwork
      :class="itemClass"
      :description="sharing.description"
      :hashtags="sharing.hashtags"

      :key="network.network"
      :media="sharing.image"
      :network="network.network"
      :quote="sharing.quote"
      :title="sharing.title"
      :twitterUser="sharing.twitterUser"
      :url="sharing.url"
      class="c-item"
      v-for="network in networks"
    >
      <q-icon
        :class="itemIconClass"
        :name="network.icon"
        class="c-item-icon"
      />

      <span v-if="showLabels">
        {{network.name}}
      </span>

    </ShareNetwork>
  </div>
</template>

<script>
  export default {
    props: {
      itemClass: {},
      itemIconClass: {},
      sharing: {},
      orientation: {default: 'horizontal'},
      showLabels: {default: false},
      caption: {}
    },

    data() {
      return {
        networks: [
          {network: 'odnoklassniki', name: 'Odnoklassniki', icon: 'fab fah fa-lg fa-odnoklassniki', color: '#ed812b'},
          {network: 'telegram', name: 'Telegram', icon: 'fab fah fa-lg fa-telegram-plane', color: '#0088cc'},
          {network: 'vk', name: 'Vk', icon: 'fab fah fa-lg fa-vk', color: '#4a76a8'},
        ]
      }
    }
  }
</script>
<style lang="scss" scoped>

  .com {
    &.s-orientation-vertical {

      .c-item {
        display: block;
      }
    }
  }

  .c-caption {

  }

  a {
    color: currentColor;
    cursor: pointer;
  }

</style>
