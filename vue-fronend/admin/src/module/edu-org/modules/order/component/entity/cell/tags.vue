<template>

  <div class="" @click.stop>

    <q-select
        v-model="tag"
        multiple
        :options="tags"
        use-chips
        stack-label
        outlined
        dense
    />

  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
  data() {
    return {
      tag: null,
      tags: [
        {
          value: 'admissionName',
          label: 'Направление аббр',
          field: 'app.admission.name',
          sortable: true,
        },
        {
          value: 'admissionDirectName',
          label: 'Направление имя',
          field: 'app.admission.direct_name',
          sortable: true,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>

td {
  white-space: normal;
}

</style>
