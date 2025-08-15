<template>

  <div>

    <div class="q-mb-xs">
      {{ [row.apiType, row.apiMethod].filter(item => !!item).join('.') }}:
    </div>

    <div class="q-mb-sm text-weight-bold">
      {{ row.apiPath }}
    </div>

    <json-viewer
        :value="row.apiArgs"
        sort
        :expand-depth=1
        v-if="row.apiArgs"
    >
    </json-viewer>

  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
  computed: {}
}
</script>

<style lang="scss" scoped>
/deep/ {
  .jv-container {
    background-color1: transparent;
  }

  .jv-code {
    padding: 4px 6px;
  }
}

</style>
