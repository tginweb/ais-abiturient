<template>
  <div class="">

    <template v-if="valueComp">
      <div :class="itemClass" v-if="!dateHide">
        {{ dateFormatted }}
      </div>

      <div
          :class="{
          [itemClass]: true,
          'text-weight-bold': timeAccent
        }"
          v-if="!timeHide"
      >
        в {{ timeFormatted }}
      </div>
    </template>
    <div v-else>
      {{placeholder}}
    </div>

  </div>
</template>

<script>


export default {

  props: {
    placeholder: {default: null},

    gutter: {default: 'sm'},
    itemClass: {default: ''},

    dateFormat: {default: 'DD.MM.YYYY'},
    dateHide: {default: false},
    dateTodayHide: {default: false},
    dateTodayName: {default: true},
    dateTomorrowName: {default: true},

    timeFormat: {default: 'HH:mm'},
    timeHide: {default: false},
    timeAccent: {default: true},

    value: {default: null},
    valueFormat: {default: 'DD.MM.YYYY HH:mm'},

    valueDate: {default: null},
    valueDateFormat: {default: 'DD.MM.YYYY'},

    valueTime: {default: null},
    valueTimeFormat: {default: 'HH:mm'},
  },
  data() {
    return {
      tabState: this.tab,
    }
  },
  computed: {

    dateFormatted() {
      if (!this.value && !this.valueDate)
        return;
      const  v = this.valueComp.tz()
      if (this.dateTodayName && v.isToday()) {
        return 'сегодня'
      }  else if (this.dateTomorrowName && v.isTomorrow()) {
        return 'завтра'
      }  else {
        return v.format(this.dateFormat)
      }
    },

    timeFormatted() {
      return this.value || this.valueTime ? this.valueComp.tz().format(this.timeFormat) : null
    },

    valueComp() {
      if (this.value) {
        return this.$util.date.parseTime(this.value, this.valueFormat, 'object')
      } else if (this.valueDate && this.valueTime) {
        return this.$util.date.parseTime(this.valueDate + ' ' + this.valueTime, this.valueDateFormat + ' ' + this.valueTimeFormat, 'object')
      } else if (this.valueDate) {
        return this.$util.date.parseTime(this.valueDate, this.valueDateFormat, 'object')
      } else if (this.valueTime) {
        return this.$util.date.parseTime(this.valueTime, this.valueTimeFormat, 'object')
      }
    }
  },
  watch: {

  },
}

</script>

<style lang="scss" scoped>


</style>
