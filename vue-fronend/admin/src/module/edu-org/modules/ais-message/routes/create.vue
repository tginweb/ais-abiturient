<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :loading="fetching"
      title="Создать пакет"
      dialogWidth="900px"
      @hide="onHide"
  >

    <div class="q-mb-md">
      <q-btn-toggle
          v-model="format"
          toggle-color="primary"
          :options="formats"
      />
    </div>

    <div class="q-mb-md">

      <div v-if="format==='csv'">
        <q-input v-model="csvText" type="textarea" rows="5" outlined/>
      </div>
      <div v-else-if="format==='json'">
        <q-input v-model="jsonText" type="textarea" rows="5" outlined/>
      </div>

    </div>

    <q-btn
        label="Process"
        @click="onProcess"
    />

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

const PapaParser = require('papaparse')


export default {
  mixins: [MVroute],
  props: {
    onResolve: {}
  },

  data() {
    return {
      csvText: '',
      jsonText: '',
      json: [],

      format: 'csv',
      formats: [
        {label: 'Text', value: 'csv'},
        {label: 'Json', value: 'json'},
      ],
    }
  },

  watch: {

    format(v, prevFormat) {

      switch (v) {
        case 'csv':
          if (prevFormat === 'json') {
            const csv = this.jsonToCsv(this.jsonText, true)
            if (csv) {
              this.csvText = csv
            }
          }

          break;

        case 'json':

          if (prevFormat === 'csv') {
            const json = this.csvToJson(this.csvText, true)
            if (json) {
              this.json = json
              this.jsonText = JSON.stringify(json)
            }
          }

          break;
      }
    }
  },

  methods: {
    jsonToCsv(csv, required = false) {

      if (!csv) {
        return false
      }

      const res = PapaParser.unparse(csv, {
        header: true,
        delimiter: ';'
      })

      return res
    },

    csvToJson(csv, required = false) {

      if (!csv) {
        return false
      }

      const res = PapaParser.parse(csv, {
        header: true,
      })

      if (res.errors.length) {
        alert('Error parse');
        return false
      }

      return res.data
    },

    async onProcess() {

      this.sourceJson = JSON.stringify(res.data)

      console.log(res)
    },


  },

}

</script>

<style lang="scss" scoped>


</style>
