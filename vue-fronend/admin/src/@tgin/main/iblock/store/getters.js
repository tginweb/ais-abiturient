function prepareElementProcess(element, params) {

    if (!element)
        return;

    params = {
        mapProps: true,
        mapPropValues: false,
        ...(params || {}),
    }

    const celement = {
        ...element,
    }

    if (params.mapProps || true) {
        celement.PROP = element.PROPS ? element.PROPS.reduce((map, prop) => {
            map[prop.CODE] = prop
            return map
        }, {}) : {}
    }

    if (params.mapPropValues || true) {
        celement.PROPV = element.PROPS ? element.PROPS.reduce((map, prop) => {
            map[prop.CODE] = prop.VAL
            return map
        }, {}) : {}
    }

    return celement
}

export function prepareElement(state) {
    return (element, params) => {
        return prepareElementProcess(element, params)
    }
}

export function prepareElements(state) {
    return (elements, params) => {
        return (elements || []).map(element => prepareElementProcess(element, params))
    }
}

export function prepareSections(state) {
    return (sections, cb) => {
        return (sections || []).map(section => {
            const csection = {
                ...section,
                PROP: section.PROPS ? section.PROPS.reduce((map, prop) => {
                    map[prop.CODE] = prop
                    return map
                }, {}) : {}
            }
            return cb ? cb(csection) : csection
        })
    }
}

export function prepareSection(state) {
    return (section, cb) => {
        const csection = {
            ...section,
            PROP: section.PROPS ? section.PROPS.reduce((map, prop) => {
                map[prop.CODE] = prop
                return map
            }, {}) : {}
        }
        return cb ? cb(csection) : csection
    }
}
