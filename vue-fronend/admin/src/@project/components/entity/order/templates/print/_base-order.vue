<template>

  <div class="print-tpl">

  </div>

</template>

<script>
import MPrintable from '@project/mixin/printable'

export default {
  mixins: [MPrintable],
  props: {
    vars: {}
  },
  methods: {

  },
  computed: {

  }
}
</script>


<style lang="scss" >


.print-tpl .quote {
  float: right;
  text-align: center;
  width: 8em;
}

.print-tpl .quote.offset-top-minus {
  margin-top: -10px;
}

.print-tpl .quote .line {
  width: 100%;
  border-bottom: 1px solid #222;
}

.print-tpl .quote .label {
  font-size: 11px;
  padding: 2px;
}


.print-tpl table {
  max-width: 100% !important;
  width: 100%;
}

.print-tpl table.bordered td {
  border: 1px solid #333;
}

.print-tpl p.dense {
  margin-bottom: 3px;
  margin-top: 3px;
}


</style>
