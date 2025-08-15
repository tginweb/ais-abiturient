import {
    fasEye,

} from '@quasar/extras/fontawesome-v5'

export const icons = {
    fasEye
}

export function boot({injectExtend}) {
    injectExtend('$icons', icons)
}

export function request({Vue, router}) {

}
