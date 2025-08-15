<template>

  <div class="q-gutter-sm">

    <q-btn
        label="word"
        dense
        outline
        :href="row.DOC_WORD_DOWNLOAD"
        type="a"
    />

    <q-btn
        label="pdf"
        dense
        outline
        :href="row.DOC_PDF_DOWNLOAD"
        type="a"
    />

  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
}
</script>

<style lang="scss" scoped>


</style>
