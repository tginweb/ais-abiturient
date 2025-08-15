export function authorized(state, getters, rootState) {
    return !!state.user.user;
}

export function user(state) {
    return state.user.user
}

export function userId(state) {
    return state.user.user && state.user.user.ID
}

export function groupsInfo(state) {
    return state.user.user.GROUPS_INFO
}

export function cabinetUrl(state, getters) {
    return getters.user && getters.user.CABINET_URL;
}

export function haveName(state, getters) {
    return state.user.user && (!!state.user.user.LAST_NAME || !!state.user.user.NAME)
}

export function nameFull(state, getters) {
    const user = getters.user
    if (user) {
        return [
            user.lastName ? user.lastName + ' ' : '',
            user.firstName ? user.firstName + ' ' : '',
            user.secondName ? user.secondName + ' ' : '',
        ].filter(item => !!item.trim()).join(' ');
    }
}

export function nameTeaser(state, getters) {
    const user = getters.user
    if (user) {
        return user.NAME_TEASER
    }
}

export function role(state, getters) {
    return getters.user && getters.user.ROLES ? getters.user.ROLES.reduce((map, val) => (map[val] = true, map), {}) : {};
}

export function isShopAdmin(state, getters) {
    return getters.user.IS_ADMIN || getters.user.IS_SHOP_ADMIN;
}

export function avatar(state, getters) {
    return state.user.user && state.user.user.AVATAR
}

export function avatarImageSrc(state, getters) {
    return getters.avatar && getters.avatar.IMAGE && getters.avatar.IMAGE.SRC || '/statics/profile1.png';
}

export function menuPersonal(state, getters, rootState, rootGetters) {

    const menu = rootGetters['menu/menusItems']['personal']

    return menu.map(item => {

        const citem = {
            ...item,
        }

        if (item.id === 'profile')
            citem.icon = 'img:/statics/profile.png'

        return citem
    })
}

export function userPhone(state, getters) {
    return state.user.user && state.user.user.PHONE;
}

export function userPhoneFormatted(state, getters) {
    return state.user.user && state.user.user.PHONE_FORMATTED;
}


export function userEmail(state, getters) {
    return state.user.user && state.user.user.EMAIL;
}

export function prop(state, getters) {
    return state.user.user && state.user.user.PROPS.reduce((map, prop) => (map[prop.CODE] = prop, map), {})
}

export function propVal(state, getters) {
    return state.user.user && state.user.user.PROPS.reduce((map, prop) => (map[prop.CODE] = prop.VAL, map), {})
}


export function editableEmail(state, getters) {
    return state.user.user && state.user.user.LOGIN_FORMAT !== 'email';
}

export function editablePhone(state, getters) {
    return state.user.user && state.user.user.LOGIN_FORMAT !== 'phone';
}
