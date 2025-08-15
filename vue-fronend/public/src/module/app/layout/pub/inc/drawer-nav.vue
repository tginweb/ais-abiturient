<template>

  <div class="com">

    <q-list class="c-steps __list text-grey-8" padding separator dark>
      <q-item
        class="__item"
        clickable
        v-ripple
        v-for="(item, index) of $store.state.app.pubMenu"
        :key="index"
        :href="item.to"
        target="_blank"
        tag="a"
        dark
      >
        <q-item-section >{{item.label}}</q-item-section>
      </q-item>
    </q-list>

  </div>

</template>

<script>

  export default {
    components: {},
    data() {
      return {}
    },
    methods: {
      onNavTo(item) {
        window.location.replace(item.to)
      }
    }
  }
</script>

<style lang="scss">

  .c-menu {
    .__item {
      .q-item__section--avatar {
        min-width: auto;
      }

      &.q-router-link--active {
        background: #428bca;
        color: #FFF;
      }
    }
  }

  .c-steps {
    background-color: transparent;
    box-shadow: none;

    .__item {
      font-size: 16px;

      &.q-router-link--active {
        background: #428bca;
        color: #fff;
      }
    }
  }

</style>
