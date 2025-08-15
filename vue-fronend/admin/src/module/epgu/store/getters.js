import {buildItemsTree, findMenuPath} from "./util";
import {cloneDeepArray} from '@common/core/lib/util/base'

export function itemsBuild(state) {
  const items = cloneDeepArray(state.menuItems)
  const tree = buildItemsTree(items)
  return {
    tree: tree,
    items: items
  }
}

export function itemsTree(state, getters) {
  return getters.itemsBuild.tree
}

export function items(state, getters) {
  return getters.itemsBuild.items
}

export function menu(state, getters) {

  const menus = getters.items.reduce((map, item) => {
    if (!item.PARENT) {
      map[item.CODE] = item
    }
    return map
  }, {});

  return menus
}

export function menuItems(state, getters) {

  const menus = getters.items.reduce((map, item) => {
    if (!item.PARENT) {
      map[item.CODE] = item.CHILDREN
    }
    return map
  }, {});

  return menus
}

export function menuItemsFindPath(state) {

  return (url, menus = []) => {

    const rootItems = state.menuItems.filter(item => !menus.length || menus.indexOf(item.menu) > -1);

    return findMenuPath(rootItems, url);
  }
}

export function menuItemsSelect(state) {
  return (filter) => {
    return state.menuItems.filter(item => item.menu === filter.menu);
  }
}

export function menuItemsPrimary(state, getters) {
  return getters.menuItemsSelect({menu: 'primary'})
}

export function menuItemsPrimaryMobile(state, getters) {
  return getters.menuItemsSelect({menu: 'primary-mobile'})
}


export function menuItemsPath(state, getters) {
  return (url, menus) => {
    return getters.menuItemsFindPath(url, menus)
  }
}

export function contextItems(state, getters) {
  return (url, menus) => {
    const path = getters.menuItemsPath(url, menus) || []

    let res = []

    if (path.length) {
      const lastItem = path.pop()
      const lastPrevItem = path.pop()

      if (lastItem.children && lastItem.children.length) {
        res = lastItem.children

      } else if (lastPrevItem) {
        res = [...lastPrevItem.children]
        //res.unshift(lastPrevItem)
      }
    }

    return res
  }
}
