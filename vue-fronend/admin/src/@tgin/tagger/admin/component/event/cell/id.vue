<template>

  <div class="q-gutter-y-xs text-grey-9 s-font-sm">
    <div
        :class="{
            'flex no-wrap items-center q-gutter-x-sm': true,
            'cursor-pointer': !!field.to,
            [field.class]: true
          }"
        v-for="(field,index) of fields"
        :key="index"
        v-if="field.label || field.value"
    >
      <q-icon v-if="field.icon" :name="field.icon"/>
      <div class="flex no-wrap">
        <div v-if="field.label" class="q-pr-sm">{{ field.label }}</div>
        <div
            v-if="field.value"
            :style="{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              ...(field.style||{})
            }"
        >
          {{ field.value }}
        </div>
      </div>
    </div>
  </div>


</template>

<script>
export default {
  props: {
    row: {},
  },

  methods: {
    doFilter(data) {
      this.$bus.emit('data.filters.set', data)
    }
  },
  computed: {
    fields() {
      const result = []

      if (this.row.ID)
        result.push({
          label: 'ID:',
          value: this.row.ID,
          style: {
            direction: 'rtl',
            maxWidth: '70px',
          }
        })

      if (this.row.requestId)
        result.push({
          label: 'ReqID:',
          value: this.row.requestId,
          style: {
            direction: 'rtl',
            maxWidth: '70px',
          }
        })


      if (this.row.clientContext)
        result.push({
          label: 'Client:',
          value: this.row.clientContext.clientUid,
          style: {}
        })

      return result
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
