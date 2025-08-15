<template>

  <q-breadcrumbs
      active-color="dark"
      class="com text-primary-brown-gray-3 s-font-3xs"
  >
    <template v-slot:separator>
      <span class="c-separator">•</span>
    </template>

    <q-breadcrumbs-el
        v-for="(item, index) of path"
        :key="index"
        :label="item.NAME"
        :to="item.URL"
        exact
    />
  </q-breadcrumbs>

</template>

<script>

export default {
  props: {
    path: {},
  },
  data() {
    return {}
  },
};
</script>
<style lang="scss" scoped>

.c-separator {
  font-size: 8px;
  line-height: 1;
  vertical-align: middle;
}

.com {
  /deep/ {
    ul {
      margin: 0 !important;
    }
  }
}

</style>
