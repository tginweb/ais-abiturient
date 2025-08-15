<template>

</template>

<script>

export default {
  props: {
    label: {},
    value: {},
    required: {},
    cls: {}
  },
  data() {
    return {
      valueState: this.value,
      loading: false
    }
  },
  watch: {
    value(v) {
      this.valueState = v
    },
    valueState(v) {
      this.$emit('input', v)
    }
  },
  async mounted() {

    if (this.cls) {
      this.loading = true
      await this.$store.dispatch('edu_epgu_dictionary/ensureDictionary', this.cls)
      this.loading = false
    }

  },

  computed: {
    options() {
      return this.cls ? this.$store.state.edu_epgu_dictionary.dictionary[this.cls] : []
    },

    rules() {
      const rules = []
      if (this.required) {
        rules.push(val => !!val || 'Обязательное поле')
      }
      return rules
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
