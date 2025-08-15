const dayjs = require('dayjs')

export function formatEpguDate(value, toFormat = 'cis_date') {
    switch (toFormat) {
        case 'cis_date':
            toFormat = 'DD.MM.YYYY'
            break
        case 'cis_date_time':
            toFormat = 'DD.MM.YYYY HH:mm:ss'
            break
    }
    return dayjs(value, 'YYYY-MM-DD').format(toFormat)
}

export function formatEpguDatetime(value, toFormat = 'cis_date') {
    switch (toFormat) {
        case 'cis_date':
            toFormat = 'DD.MM.YYYY'
            break
        case 'cis_date_time':
            toFormat = 'DD.MM.YYYY HH:mm:ss'
            break
    }
    return dayjs(value, 'YYYY-MM-DD').format(toFormat)
}


export function formatToEpguDate(value, fromFormat = 'cis_date') {
    switch (fromFormat) {
        case 'cis_date':
            fromFormat = 'DD.MM.YYYY'
            break
        case 'cis_date_time':
            fromFormat = 'DD.MM.YYYY HH:mm:ss'
            break
        case 'jsdate':
            return dayjs(value).format('YYYY-MM-DD')
    }

    return dayjs(value, fromFormat).format('YYYY-MM-DD')
}

export function formatToEpguDatetime(value, fromFormat = 'cis_date') {
    switch (fromFormat) {
        case 'cis_date':
            fromFormat = 'DD.MM.YYYY'
            break
        case 'cis_date_time':
            fromFormat = 'DD.MM.YYYY HH:mm:ss'
            break
        case 'jsdate':
            return dayjs(value).format('YYYY-MM-DDTHH:mm:ssZ')
    }

    return dayjs(value, fromFormat).format('YYYY-MM-DDTHH:mm:ssZ')
}
