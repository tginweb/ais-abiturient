const dayjs = require('dayjs')

export default function parseTime(val, formatInput, formatOutput = 'tms') {

    switch (formatInput) {
        case 'datetime':
            formatInput = 'DD.MM.YYYY HH:mm'
            break
        case 'date':
            formatInput = 'DD.MM.YYYY'
            break
    }

    let t

    if (typeof val === 'string') {
        t = dayjs(val, formatInput, true)
    } else if (typeof val === 'number') {
        t = dayjs(val)
    } else if (typeof val === 'object') {
        t = val
    } else {
        return;
    }

    let res

    switch (formatOutput) {
        case 'ts':
            res = t.unix()
            break
        case 'tms':
        case 'tsm':
            res = t.valueOf()
            break
        case 'object':
            res = t
            break
        default:
            res = t.format(formatOutput)
    }

    return res
}

