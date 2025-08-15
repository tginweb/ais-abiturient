<template>

  <div>


    <q-select
        ref="input"
        v-model="valueState"
        :options="optionsState"
        :rules="[
            val => !bind.required || !!val || 'Обязательное поле',
            ...rules
        ]"
        :stack-label="!!valueState"
        emit-value
        fill-input
        hide-dropdown-icon
        hide-selected
        input-debounce="1000"
        map-options
        use-input
        v-bind="bind"
        @filter="filterFn"
        @input="onChange"
        @input-value="onInputValue"
    >
      <template
          v-for="(_, name) in $slots"
          :slot="name"
      >
        <slot :name="name"/>
      </template>
    </q-select>
  </div>

</template>

<script>

import quasarSelectProps from '@tgin/quasar/lib/props/select'
import {propsWatch} from '@tgin/main/common/lib/util/vue'

export default {
  props: {
    ...quasarSelectProps,
    value: {},
    optionLabel: {
      default: 'label'
    },
    optionValue: {
      default: 'value'
    },
    recordsetQuery: {},
    query: {},
    filter: {default: () => ({})},
    filterPath: {default: 'query'},
  },
  data() {
    return {
      bind: this.$util.vue.propsPass(quasarSelectProps, this),
      optionsState: [],
      valueState: this.value
    }
  },
  async mounted() {
    if (this.valueState) {
      const entity = await this.queryValue(this.valueState)
      if (entity) {
        const option = this.prepareOption(entity)
        this.optionsState = [option]
        this.$refs.input.updateInputValue(option.label)
      }
    }
  },
  computed: {
    nav() {
      return {
        limit: 10
      }
    },
  },
  watch: {
    ...propsWatch(quasarSelectProps),
    value(v) {
      if (typeof this.valueState === 'object') {
        if (this.valueState.value !== v)
          this.valueState = v
      } else {
        if (this.value !== v)
          this.valueState = v
      }
    },
    valueState(v) {
      if (v) {
        if (typeof v === 'object') {
          this.$emit('input', v.value)
        } else {
          this.$emit('input', v)
        }
      }
    }
  },
  methods: {

    onInputValue(val) {

      if (!val) {
        this.$nextTick(() => {
          this.valueState = null
          this.$emit('input', null)
        })
      }
    },

    onChange(v) {
      //console.log(v)
      // this.valueState = this.getOptionField(v, this.optionValue)
    },

    async queryValue(value) {

      const {data} = await this.$apollo.query({
        query: this.query ? this.query() : this.recordsetQuery(),
        fetchPolicy: 'no-cache',
        variables: {
          id: value,
          nav: {
            limit: 1
          }
        }
      })

      const options = this.query ? data.res : data.res.nodes

      return options && options.length ? options[0] : null
    },

    querySuggestions(query, count) {

      return new Promise(async (resolve, reject) => {
        try {

          const filter = {
            ...this.filter
          }

          if (this.filterPath)
            this.$util.base.deepSet(filter, this.filterPath, query)

          const {data} = await this.$apollo.query({
            query: this.query ? this.query() : this.recordsetQuery(),
            fetchPolicy: 'no-cache',
            variables: {
              filter: filter,
              nav: {
                limit: 10
              }
            }
          })

          const options = this.query ? data.res : data.res.nodes
          resolve(options)
        } catch (e) {
          console.log(e)
        }
      })
    },

    getOptionField(option, field) {
      if (typeof field === 'function') {
        return field(option)
      }
      return option[field]
    },

    prepareOption(option) {
      return {
        label: this.getOptionField(option, this.optionLabel),
        value: this.getOptionField(option, this.optionValue),
      }
    },

    filterFn(query, update, abort) {
      if (!query) {
        abort()
        return
      }
      this.querySuggestions(query, 10).then((suggestions) => {
        update(() => {
          this.optionsState = suggestions.map(suggestion => this.prepareOption(suggestion))
        })
      }).catch((data) => {
        abort()
      }).then(() => {

      })
    },

  }
}
</script>
