import {Screen} from 'quasar'
import screenExtend from "../lib/screen-extend";

const useragent = require('express-useragent')

export function serverScreenNameEval(state) {

    return (ssrContext) => {

        const headers = ssrContext.req.headers
        const ua = useragent.parse(headers['user-agent']);
        let serverScreen

        if (ua.isMobile) {
            serverScreen = 'mobile'
        } else if (ua.isTablet) {
            serverScreen = 'tablet'
        } else {
            serverScreen = 'desktop'
        }

        return serverScreen
    }

}

export function screenWidthByName(state, name) {
    const sizes = {
        mobile: 500,
        tablet: 800,
        desktop: 1800,
    }

    return (name) => {
        return sizes[name]
    }
}

export function screen(state, getters) {

    let screen

    if ((typeof window === 'undefined' || process.env.SERVER) && state.serverScreenName) {
        screen = getters['serverScreen']
    } else {
        screen = Screen
    }

    return screenExtend(screen)
}

export function serverScreen(state, getters) {

    let w

    w = getters['screenWidthByName'](state.serverScreenName || 'desktop')


    const s = {
        sm: 600,
        md: 1024,
        lg: 1440,
        xl: 1920
    }

    const result = {
        w: w,
        lt: {
            sm: true,
            md: true,
            lg: true,
            xl: true
        },
        gt: {
            xs: false,
            sm: false,
            md: false,
            lg: false
        },
        xs: true,
        sm: false,
        md: false,
        lg: false,
        xl: false,
    }

    result.gt.xs = w >= s.sm
    result.gt.sm = w >= s.md
    result.gt.md = w >= s.lg
    result.gt.lg = w >= s.xl
    result.lt.sm = w < s.sm
    result.lt.md = w < s.md
    result.lt.lg = w < s.lg
    result.lt.xl = w < s.xl
    result.xs = result.lt.sm
    result.sm = result.gt.xs === true && result.lt.md === true
    result.md = result.gt.sm === true && result.lt.lg === true
    result.lg = result.gt.md === true && result.lt.xl === true
    result.xl = result.gt.lg

    const screenName = (result.xs === true && 'xs') ||
        (result.sm === true && 'sm') ||
        (result.md === true && 'md') ||
        (result.lg === true && 'lg') ||
        'xl'

    result.name = screenName

    return result
}
