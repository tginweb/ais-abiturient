<template>
  <div>

    <q-select
        :error-messages="errorMessages"
        :filled="filled"
        :label="label"
        :options="options"
        :outlined="outlined"
        :placeholder="placeholder"
        :rules="rules"
        :hint="hint"
        @change="onChange"
        @filter="filterFn"
        fill-input
        hide-dropdown-icon
        hide-selected
        input-debounce="1000"
        ref="input"
        use-input
        v-model="valueState"
        lazy-rules
        :loading="loading"
        :readonly="readonly"
    >
      <template v-if="$slots.append" v-slot:append>
        <slot name="append"/>
      </template>

      <template v-slot:option="scope">

        <q-item
            v-bind="scope.itemProps"
            clickable
            @click="$refs.input.toggleOption(scope.opt)"
        >
          <q-item-section>
            <q-item-label class="text-dark">
              {{ scope.opt.caption }}
            </q-item-label>
          </q-item-section>
        </q-item>

      </template>

    </q-select>

  </div>

</template>

<script>
import axios from 'axios'

const BASE_URL = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party'

export default {

  apiCallback: null,
  props: {
    value: {},
    hint: {},
    searchInput: String,
    label: {},
    outlined: {default: false},
    filled: {default: false},
    placeholder: {},
    disabled: Boolean,
    rules: {default: () => []},
    errorMessages: {default: () => []},
    fromBound: {},
    toBound: {},
    valueData: {},
    loading: {},
    readonly: {},
    location: {},
    locations: {},
  },
  data() {
    return {
      isLoading: false,
      options: [],
      search: this.searchInput,
      selectedAddress: null,
      valueState: this.value ? (this.valueData ? this.value.name : this.value) : '',
      queryToken: null,
      queryAddressToken: null,

      valueStateUpdatedExternal: false,
    }
  },
  watch: {
    value(val) {
      this.valueStateUpdatedExternal = true
      this.valueState = val
    },
    valueState(val) {
      if (this.valueStateUpdatedExternal || this.value === val) {
        this.valueStateUpdatedExternal = false
        return
      }
      if (typeof val === 'object') {
        this.$emit('change', val)
        this.$emit('input', val.value)
      }
    },
  },
  computed: {},

  methods: {

    filterFn(query, update, abort) {

      if (!query) {
        abort()
        return
      }

      this.querySuggestions(query).then((suggestions) => {

        update(() => {

          let options = [];

          suggestions.forEach(function (suggestion) {

            let option = {
              companyName: suggestion.value,
              caption: suggestion.value + ' (ИНН ' + suggestion.data.inn + ')',
              label: suggestion.data.inn,
              value: suggestion.data.inn,
              data: suggestion.data
            }

            options.push(option)
          });

          this.options = options;

        });

      }).catch((data) => {

        abort()

      }).then(() => {


      })
    },

    async querySuggestions(query, count) {

      return new Promise(async (resolve, reject) => {

        if (this.queryToken) this.queryToken.cancel();

        this.queryToken = axios.CancelToken.source();

        this.isLoading = true;

        const apiUrl = `${BASE_URL}`
        const apiKey = this.$config.get('DADATA.API_KEY')

        const headers = {
          'Authorization': `Token ${apiKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }

        let params = {};

        params.query = query;
        params.count = count || 10

        axios.post(apiUrl, params, {
          headers: headers,
          cancelToken: this.queryToken.token
        }).then((response) => {

          console.log(response.data)

          resolve(response.data.suggestions);

        }).catch(() => {

          reject();

        }).then(() => {

          this.isLoading = false;

        })
      })
    },

    onChange(v) {

    },
  },
  mounted() {
    //this.$refs.input.inputValue = this.value
  }
};
</script>
<style lang="scss" scoped>


</style>
