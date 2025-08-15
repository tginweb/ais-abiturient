import {
  fabFacebook,
  fasChartLine,
  fasBriefcase,
  fasCompass,
  fasFileImport,
  fasClipboardCheck,
  fasHandshake,
  farCheckCircle,
  farShareSquare
} from '@quasar/extras/fontawesome-v5'

import {evaMinus} from '@quasar/extras/eva-icons'

export const icons = {
  farShareSquare,
  fabFacebook,
  fasChartLine,
  fasBriefcase,
  fasCompass,
  fasFileImport,
  fasClipboardCheck,
  fasHandshake,
  farCheckCircle
}

export function boot({injectExtend}) {
  injectExtend('$icons', icons)
}

export function request({Vue, router}) {

}
