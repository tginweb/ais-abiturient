const dayjs = require('dayjs')

export default function timestampToFormat(ts, format) {

  ts = parseInt(ts)

  if (ts > 0) {

    if (ts < 2147483647) {
      ts = ts * 1000
    }

    switch (format) {
      case 'date':
        format = 'DD.MM.YYYY'
        break;
      case 'datetime':
        format = 'DD.MM.YYYY HH:mm'
        break;
      case 'time':
        format = 'HH:mm'
        break;
    }

    return dayjs(ts).tz().format(format)
  }
}

