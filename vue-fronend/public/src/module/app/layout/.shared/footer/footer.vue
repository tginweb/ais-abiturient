<template>

  <div class="com bg-primary-brown-1 text-dark link-color-current">


  </div>

</template>

<script>


  export default {
    name: 'layout.footer',
    serverCacheKey: props => 'layout.footer',
    components: {},
    apollo: {},
    data() {
      return {

        menuApps: [
          {title: '', url: 'sdsdd', icon: this.$icons.fabVk},
          {title: '', url: 'sdsdd', icon: this.$icons.fabInstagram},
        ],
        issuePrints: null
      }
    },
    created() {

    },
    methods: {}
  }
</script>

<style lang="scss" scoped>

  .footer {

    a {
      color: #FFF;

    }
  }

  .c-info-copyright {
    font-size: 19px;
    line-height: 1;
  }

  .c-info-desc {
    color: rgba(255, 255, 255, .72);
    font-size: 13px;
  }

  .c-info-link {

  }

  .c-menu {

    .c-menu-header {
      color: rgba(255, 255, 255, .5);
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .5px;
      margin: 0 0 10px 0;
    }

    .c-menu-items {
      padding: 0;
      margin: 0;
      list-style-type: none;

      li {
        font-size: 17px;
        margin: 0 0 5px 0;

        a {
          text-decoration: none;
        }
      }
    }
  }


</style>
