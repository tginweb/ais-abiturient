import {
    fabVk,
    fabOdnoklassniki,
    fasShareAlt,
    farShareSquare,

} from '@quasar/extras/fontawesome-v5'

import {
    evaShare,
    evaShareOutline
} from '@quasar/extras/eva-icons'


export const icons = {
    fabVk,
    fabOdnoklassniki,
    evaShare,
    evaShareOutline
}

export function boot({injectExtend}) {
    injectExtend('$icons', icons)
}

