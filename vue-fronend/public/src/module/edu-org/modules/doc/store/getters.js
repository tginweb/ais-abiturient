import {treeBuild} from "@tgin/main/common/lib/util/base";
import treeReduce from "@tgin/main/common/lib/util/base/treeReduce";

export function docCategories(state) {

    return (filterRoots, filterIds) => {

        let items = state.app.docCategories.map(item => ({
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
                nameFull: node.name + ' [' + node.id + ']',
                name: node.name,
            }

            nodes.push(_node)

            return nodes
        }, [], 'children')

        return nodes
    }

}


export function docTypesByCat(state) {
    return (catId) => {
        return state.app.docTypes.filter(item => item.fields.IdCategory === catId)
    }
}

export function docTypeById(state) {
    return state.app.docTypes.reduce((map, item) => {
        map[item.id] = item
        return map
    }, {})
}
