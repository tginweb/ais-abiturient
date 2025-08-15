export function widgetsTree(state, getters, rootState, rootGetters) {
    let widgets = []

    for (const moduleName of rootGetters['moduleNames']) {
        if (rootGetters[moduleName + '/widgets']) {
            Array.prototype.push.apply(widgets, rootGetters[moduleName + '/widgets'])
        }
    }

    const widgetsById = widgets.reduce((map, widget) => {
        map[widget.id] = widget
        return map
    }, {})

    widgets = Object.values(widgetsById)

    const res = []

    for (let widget of widgets) {

        if (widget.parent) {
            const parentId = widget.parent
            const parentWidget = widgetsById[parentId]

            if (parentWidget) {
                if (!parentWidget.children)
                    parentWidget.children = []

                parentWidget.children.push(widget)
            }
        } else {
            res.push(widget)
        }
    }

    return res
}

export function widgetsByGroup(state, getters, rootState, rootGetters) {
    return getters.widgetsTree.reduce((map, widget) => {
        for (const scopeName of widget.groups) {
            map[scopeName] = map[scopeName] || []
            map[scopeName].push(widget)
        }
        return map
    }, {});
}
