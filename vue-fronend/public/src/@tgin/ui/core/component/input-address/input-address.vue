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
        @input="onChange"
        fill-input
        hide-dropdown-icon
        hide-selected
        input-debounce="1000"
        ref="input"
        use-input
        v-model="content"
        lazy-rules
        :loading="loading"
        :readonly="readonly"
    >
      <template v-if="$slots.append" v-slot:append>
        <slot name="append"/>
      </template>
    </q-select>

  </div>

</template>

<script>
import axios from 'axios'

const BASE_URL = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest'

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
      content: this.value ? (this.valueData ? this.value.name : this.value) : '',
      queryToken: null,
      queryAddressToken: null,
    }
  },
  watch: {
    search(query) {

    },

    value(val) {
      this.content = this.valueData ? val.name : val;
    }
  },
  computed: {},

  methods: {

    filterFn(query, update, abort) {


      if (!query)  {
        abort()
        return
      }

      this.querySuggestions(query).then((suggestions) => {

        update(() => {

          let options = [];

          suggestions.forEach(function (suggestion) {

            let option = {
              label: suggestion.value,
              value: suggestion.value,
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

        const apiUrl = `${BASE_URL}/address`
        const apiKey = this.$config.get('DADATA.API_KEY')

        const headers = {
          'Authorization': `Token ${apiKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }

        let params = {
        };

        if (this.locations) {
          params.locations = this.locations
        }

        params.query = query;
        params.count = count || 10

        if (this.fromBound)
          params.from_bound = {"value": this.fromBound}

        if (this.toBound)
          params.to_bound = {"value": this.toBound}

        //params.restrict_value = true

        axios.post(apiUrl, params, {
          headers: headers,
          cancelToken: this.queryToken.token
        }).then((response) => {

          resolve(response.data.suggestions);

        }).catch(() => {

          reject();

        }).then(() => {

          this.isLoading = false;

        })
      })
    },

    setValueWithData(valValue, valData) {

      let origValue = valValue,
          queryValue = valValue,
          queryValueWithoutFlat = valValue,
          queryValueFlat = '',
          queryCount = 10;

      if (valData) {

        if (valData.geo_lat) {
          this.$emit('changeData', valValue, valData)
          return;
        }

        if (valData.unrestricted_value) {
          queryValue = valData.unrestricted_value
          queryCount = 1
        }
      } else {
        var result = queryValue.match(/(.+?)\s*\,?(\s*кв\.?\s*\d+\s*)$/i);

        if (result && result[1]) {

          queryValue = result[1].trim();
          queryValueFlat = result[2].trim();
        }
      }

      let formatValue = (value) => {
        return queryValueFlat ? value + ', ' + queryValueFlat : value;
      }

      this.querySuggestions(queryValue, queryCount).then((suggestions) => {

        if (suggestions.length > 0) {

          let suggestion = suggestions[0];

          if (suggestion.data.geo_lat) {

            valValue = formatValue(suggestion.value)
            valData = suggestion.data

            this.content = valValue

            this.$emit('changeData', valValue, valData, 'success')

          } else {

            this.querySuggestions(suggestion.unrestricted_value, 1).then((subquerySuggestions) => {

              if (subquerySuggestions.length) {

                valValue = formatValue(subquerySuggestions[0].value)
                valData = subquerySuggestions[0].data

                this.content = valValue

                this.$emit('changeData', valValue, valData, 'success')

              } else {

                this.$emit('changeData', origValue, valData, 'notfound')
              }

            }).catch(() => {

              this.$emit('changeData', origValue, valData, 'notfound')
            })


          }

        } else {
          this.$emit('changeData', origValue, valData, 'notfound')
        }

      }).catch(() => {

        this.$emit('changeData', origValue, valData, 'error')

      }).then(() => {


      })
    },


    onChange(v) {

      let valValue = v, valData;

      if (v) {

        if (typeof v == 'object') {
          valValue = v.value;

          valData = {
            name: v.value,
            fias_id: v.data.fias_id,
            fias_code: v.data.fias_code,
            house: v.data.house
          }
        }

        setTimeout(() => {
          this.setValueWithData(valValue, valData);
        }, 50);

      } else {
        this.$emit('changeData', '', valData, 'empty')
      }

      this.$emit('input', valData)
    },

    updateSearchInput(v) {

    },

    getInput() {

      return this.$refs.input;
    }
  },
  mounted() {
    //this.$refs.input.inputValue = this.value
  }
};
</script>
<style lang="scss" scoped>


</style>
