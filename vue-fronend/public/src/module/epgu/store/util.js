export function buildItemsTree(list) {

  var map = {}, node, roots = [], i;

  for (i = 0; i < list.length; i += 1) {
    map[list[i].ID] = i; // initialize the map
    list[i].CHILDREN = []; // initialize the children
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.PARENT) {
      // if you have dangling branches check that map[node.parentId] exists
      if (map[node.PARENT] && list[map[node.PARENT]])
        list[map[node.PARENT]].CHILDREN.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export function buildMenu(items, topCode) {

  const topItem = items.find(item => !item.PARENT && item.CODE === topCode)

  topItem.ID

  const findChildrenTree = (items, parents) => {

    let foundPath, foundChildrenPath;

    for (let i = 0; i < items.length; i++) {

      let path = [...parents],
        found = false

      const item = items[i]

      path.push(item)

      if (item.url == url) {
        found = true
      }

      if (item.children) {
        foundChildrenPath = scanTree(item.children, path)

        if (foundChildrenPath) {
          path = [...foundChildrenPath]
          found = true
        }
      }

      if (found) {
        foundPath = [...path]
      }
    }

    return foundPath
  }

  return scanTree(menu, [])
}


export function findMenuPath(menu, url) {

  const scanTree = (items, parents) => {

    let foundPath, foundChildrenPath;

    for (let i = 0; i < items.length; i++) {

      let path = [...parents],
        found = false

      const item = items[i]

      path.push(item)

      if (item.url == url) {
        found = true
      }

      if (item.children) {
        foundChildrenPath = scanTree(item.children, path)

        if (foundChildrenPath) {
          path = [...foundChildrenPath]
          found = true
        }
      }

      if (found) {
        foundPath = [...path]
      }
    }

    return foundPath
  }

  return scanTree(menu, [])
}
