import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {MenuItemModel} from './entity/menu-item.model';
import {MenuModel} from './entity/menu.model';
import {CoreService} from "~modules/core/core.service";
import treeFilter from "~lib/util/base/treeFilter";


@Injectable()
export class MenuService {

    constructor(
        @InjectModel(MenuItemModel) public readonly menuItemModel: ReturnModelType<typeof MenuItemModel>,
        @InjectModel(MenuModel) public readonly menuModel: ReturnModelType<typeof MenuModel>,
        private readonly coreService: CoreService,
    ) {
    }

    getMenusTree(filterPerms = ['admin']) {


        let menuItems = []

        menuItems = this.coreService.hooks.applyFilters('menu_items', menuItems);

        const tree = this.arrayToTree(this.filterItemsAccess(menuItems))

        let itemId = 0

        const scan = (nodes) => {

            nodes.forEach((node) => {

                node.id = node.id || itemId++

                if (node.children && node.children.length)
                    scan(node.children)
            })

            return nodes
        }

        const filter = (node) => {
            if (node.perms && !filterPerms.includes('admin')) {
                if (node.perms && node.perms.length && !node.perms.filter(value => filterPerms.includes(value)).length) return false
            }

            return true
        }

        return scan(treeFilter(tree, filter))
    }

    filterItemsAccess(items) {

        return items.filter(item => {

            if (item.accessGroups) {
                return true
            }

            return true
        })
    }

    arrayToTree(list) {

        var mapById = {},
            mapByCode = {},
            node,
            roots = [],
            i;

        for (i = 0; i < list.length; i += 1) {
            mapById[list[i].id] = i;
            mapByCode[list[i].code] = i;

            if (!list[i].children)
                list[i].children = []; // initialize the children
        }

        // console.log(mapByCode)


        for (i = 0; i < list.length; i += 1) {
            node = list[i];
            if (node.parentId) {
                if (typeof mapById[node.parentId] !== "undefined")
                    list[mapById[node.parentId]].children.push(node);
            } else if (node.parentCode) {
                if (typeof mapByCode[node.parentCode] !== "undefined") {
                    list[mapByCode[node.parentCode]].children.push(node);
                }
            } else {
                roots.push(node);
            }
        }

        return roots;
    }
}
