import {treeBuild} from "@tgin/main/common/lib/util/base";
import treeReduce from "../../../../../../../../@tgin/main/common/lib/util/base/treeReduce";

export function statusById(state) {
    return state.app.statuses.reduce((map, obj) => (map[obj.id] = obj, map), {})
}

export function statusOptions(state) {
    return state.app.statuses.map(status => ({
        ...status,
        disable: !status.selectable
    }))
}

export function appStatusOptions(state) {
    return state.app.appStatuses.map(status => ({
        ...status,
        disable: !status.selectable
    }))
}


export function ordersPivoted(state, getters, rootState) {
    return (items) => {

        return items.map(item => {

            const result = {
                ...item
            }

            return result;
        })
    }
}

export function pivotPresets(state, getters, rootState) {
    return [
        {
            value: 'all',
            label: 'Без группировки',
            cols: [],
            rows: [],
            vals: ['Цена'],
        },
        {
            value: 'level',
            label: 'Уровень образования',
            cols: [],
            rows: ['Уровень образования'],
            vals: ['Количество'],
        },
        {
            value: 'admission',
            label: 'Направление',
            cols: [],
            rows: ['Направление: наименоввние'],
            vals: ['Количество'],
        },
        {
            value: 'source',
            label: 'Основа',
            cols: [],
            rows: ['Основа'],
            vals: ['Количество'],
        },
    ]
}

export function pivotPresetsById(state, getters, rootState) {
    return getters.pivotPresets.reduce((map, obj) => (map[obj.value] = obj, map), {})
}


export function epguDocCategories(state) {

    return (filterRoots, filterIds) => {

        let items = state.app.epguDocCategories.map(item => ({
            ...item,
            parentId: item.fields.IdParent
        }))

        if (filterIds) {
            items = items.filter((item) => filterIds.indexOf(item.id) > -1).map(item => ({
                ...item,
                parentId: null
            }))
        }

        let tree = treeBuild(items, 'id', 'parentId', 'children')

        if (filterRoots) {
            tree = tree.filter(item => filterRoots.indexOf(item.id) > -1)
        }

        const nodes = treeReduce(tree, (nodes, node, path) => {

            const _node = {
                ...node,
                disable: node.children && node.children.length ? true : false,
                name: node.name + ' [' + node.id + ']'
            }

            nodes.push(_node)

            return nodes
        }, [], 'children')

        return nodes
    }

}


export function epguDocTypesByCat(state) {
    return (catId) => {
        return state.app.epguDocTypes.filter(item => item.fields.IdCategory === catId)
    }
}

export function epguDocTypeById(state) {
    return state.app.epguDocTypes.reduce((map, item) => {
        map[item.id] = item
        return map
    }, {})
}
