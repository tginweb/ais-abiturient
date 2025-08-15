<template>

  <div>
    <div class="q-gutter-y-sm text-grey-9">

      <div
          :class="{
            'flex no-wrap items-center q-gutter-x-sm': true,
            'cursor-pointer': !!field.to,
            [field.class]: true
          }"
          v-for="(field,index) of fields"
          :key="index"
          v-if="field.label || field.value"
          @click="onClick(field, $event)"
      >
        <q-icon v-if="field.icon" :name="field.icon"/>
        <div>
          <span v-if="field.label" class="q-pr-md">{{ field.label }}</span>

          <template v-if="field.value">
            <router-link v-if="field.to" :to="field.to">
              {{ field.value }}
            </router-link>
            <span v-else>
              {{ field.value }}
             </span>
          </template>

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
    onClick(field, e) {
      if (field.to) {
        e.stopPropagation()
        this.$router.push(field.to)
      }
    }
  },
  computed: {
    fields() {
      const result = []

      if (this.row.PROPS_BY_CODE.FIO)
        result.push({
          value: this.row.PROPS_BY_CODE.FIO.VALUE,
          class: 'text-weight-bold'
        })

      if (this.row.PROPS_BY_CODE.PHONE)
        result.push({
          icon: 'phone',
          value: this.row.PROPS_BY_CODE.PHONE.VALUE
        })

      if (this.row.PROPS_BY_CODE.EMAIL)
        result.push({
          icon: 'mail_outline',
          value: this.row.PROPS_BY_CODE.EMAIL.VALUE
        })

      if (this.row.USER) {
        result.push({
          icon: 'person',
          value: this.row.USER.LOGIN + ' [' + this.row.USER.ID + ']',
          to: {name: 'user:user', params: {entityId: this.row.USER_ID}},
        })
      } else if (this.row.USER_ID) {
        result.push({
          icon: 'person',
          value: 'пользователь [' + this.row.USER_ID + ']',
          to: {name: 'user:user', params: {entityId: this.row.USER_ID}},
        })
      }

      return result
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
