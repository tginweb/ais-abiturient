export default function treeReduce(data, fn, acc, childrenKey = 'children', path = []) {
    data.forEach(function (node) {
        acc = fn(acc, node, path)
        if (node[childrenKey]) acc = treeReduce(node[childrenKey], fn, acc, childrenKey, [...path, ...[node]]);
    })
    return acc
}

