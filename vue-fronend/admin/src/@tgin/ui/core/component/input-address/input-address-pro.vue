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
    >
      <template v-slot:loading>

      </template>
    </q-select>

  </div>

</template>

<script>

  export default {

    props: {
      api: {},
      value: {},
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
      location: {}
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

        if (!query) return;

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


        }).then(() => {


        })
      },

      async querySuggestions(query, count) {

        return new Promise(async (resolve, reject) => {

          const res = await this.api.getAddrress(query);
          resolve(res);

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
