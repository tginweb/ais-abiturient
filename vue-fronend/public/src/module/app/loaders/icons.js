import {
  fabFacebook,
  fasChartLine,
  fasBriefcase,
  fasCompass,
  fasFileImport,
  fasClipboardCheck,
  fasHandshake
} from '@quasar/extras/fontawesome-v5'

import {evaMinus} from '@quasar/extras/eva-icons'

export const icons = {
  fabFacebook,
  fasChartLine,
  fasBriefcase,
  fasCompass,
  fasFileImport,
  fasClipboardCheck,
  fasHandshake
}

export function boot({injectExtend}) {
  injectExtend('$icons', icons)
}

export function request({Vue, router}) {

}
