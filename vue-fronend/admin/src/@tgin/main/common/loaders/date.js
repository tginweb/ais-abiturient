const dayjs = require('dayjs')
const isYesterday = require('dayjs/plugin/isYesterday')
const isToday = require('dayjs/plugin/isToday')
const isTomorrow = require('dayjs/plugin/isTomorrow')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const customParseFormat = require('dayjs/plugin/customParseFormat')

require('dayjs/locale/ru')

export function boot({Vue}) {


  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.extend(isYesterday)
  dayjs.extend(isToday)
  dayjs.extend(isTomorrow)
  dayjs.extend(customParseFormat)

  dayjs.tz.setDefault('Asia/Irkutsk')

  dayjs.locale('ru') // use locale globally
}

export function request(ctx) {

}
