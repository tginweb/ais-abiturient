<template>
  <div
      class="com q-px-md border-b-1 "
      :class="{
        'unreaded': !item.READED,
        'bg-green-1': !item.READED,
        'border-primary-brown-gray-2': !item.READED,
        'border-primary-brown-gray-1': item.READED,
      }"
  >

    <div :class="dateClass">
      {{dateCreate}}
    </div>

    <div class="flex items-center">
      <div class="q-mr-sm">
        <span
            class="s-font-xl"
            style="vertical-align:middle;"
            :class="{
              'text-primary-green-4': !item.READED,
              'text-grey-5': item.READED,
            }"
        >&#9679;</span>
      </div>

      <div
          :class="{
            'text-weight-bold': true
          }"
      >
        {{item.TITLE}}
      </div>

    </div>

    <div class="q-mb-sm" v-if="item.BODY">
      {{item.BODY}}
    </div>

  </div>
</template>

<script>


export default {
  components: {},
  props: {
    item: {},
    dateClass: {default: 'text-grey-6 q-mb-xs s-font-xs'},
    mode: {default:'page'}
  },
  data() {
    return {}
  },
  computed: {
    dateCreate() {
      return this.$util.date.timestampToFormat(this.item.DATE_CREATE, 'datetime')
    }
  }

}
</script>

<style lang="scss" scoped>

@keyframes bg-fade {
  from {background-color:rgba(232, 245, 233, 1);}
  to {background-color:rgba(232, 245, 233, 0);}
}

.com.unreaded1 {
  background-color:rgba(232, 245, 233, 1);
  animation: bg-fade 5s forwards;
}

</style>
