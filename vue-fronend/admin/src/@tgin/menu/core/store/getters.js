import {buildItemsTree, findMenuPath} from "./util";

export function menusItems(state, getters) {
    return state.app.menus.reduce((map, menu) => {
        if (menu.code) {
            map[menu.code] = menu.children
        }
        return map
    }, {})
}

export function breadcrumbs(state, getters) {
    return (url, menuCodes) => {

        if (!menuCodes) {
            menuCodes = Object.keys(state.app.menus)
        }

        for (let i = 0; i < menuCodes.length; i++) {
            const menuCode = menuCodes[i]

            const menu = state.app.menus[menuCode]


            if (menu && menu.children) {
                const path = findMenuPath(menu.children, url)

                if (path) {
                    return path
                }
            }
        }

        return []
    }
}
