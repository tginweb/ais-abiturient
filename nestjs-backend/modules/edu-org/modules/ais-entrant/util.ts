const dayjs = require('dayjs')

export function formatAisDate(value, toFormat = 'cis_date') {
    const time = dayjs(value, 'YYYY-MM-DD HH:mm:ss.SSS')
    switch (toFormat) {
        case 'cis_date':
            toFormat = 'DD.MM.YYYY'
            break
        case 'cis_date_time':
            toFormat = 'DD.MM.YYYY HH:mm:ss'
            break
        case 'jsdate':
            return time.toDate()
    }
    return time.format(toFormat)
}
