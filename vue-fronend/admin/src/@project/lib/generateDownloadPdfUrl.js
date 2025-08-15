const md5 = require('blueimp-md5')

export default function (info) {

  let nids = [], ids = []

  if (info && Array.isArray(info) && info.length) {

    nids = info.map((item) => {
      return item && typeof item === 'object' ? item.nid : null
    }).filter(val => !!val)

    ids = info.map((item) => {
      return item && typeof item === 'object' ? item.id : null
    }).filter(val => !!val)

    const params = {
      id: nids.join('.'),
      hash: md5(ids.join('.'))
    }

    return '/api/doc/downloadPdf?id=' + params.id + '&hash=' + params.hash
  }
}

