import timestampToFormat from '../date/timestampToFormat'

export default function date(val) {
    return timestampToFormat(val, 'DD.MM.YYYY')
}
