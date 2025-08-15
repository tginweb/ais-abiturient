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

  computed: {
    fields() {
      const result = []

      if (this.row.userId)
        result.push({
          label: 'UserID:',
          value: this.row.user ? this.row.user.LOGIN + ' [' + this.row.user.ID + ']' : this.row.userId
        })

      if (this.row.fuserId)
        result.push({
          label: 'FuserID:',
          value: this.row.fuserId
        })

      if (this.row.vorderId)
        result.push({
          label: 'VorderID:',
          value: this.row.vorderId,
        })

      if (this.row.sessionId)
        result.push({
          label: 'SessID:',
          value: this.row.sessionId,
          style: {
            direction: 'rtl',
            maxWidth: '70px',
          }
        })

      return result
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
