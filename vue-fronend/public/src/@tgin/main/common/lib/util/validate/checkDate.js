import parseTime from '../date/parseTime'

export default function checkDate(val, format = 'date') {
    const res = parseTime(val, format, 'tsm')
    return res && res > 0 ? true : false
}
