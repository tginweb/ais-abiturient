import timestampToFormat from '../date/timestampToFormat'

export default function datetime(val) {
    return timestampToFormat(val, 'DD.MM.YYYY HH:mm')
}
