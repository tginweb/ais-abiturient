import {treeBuild, treeReduce} from "@tgin/main/common/lib/util/base";

export default class {

    constructor(ctx) {
        this.ctx = ctx

        this.iblockSections = ctx.$config.get('STORAGE.CATALOG_SECTIONS_PATHS', {})

        this.entityTypes = ctx.$config.get('STORAGE.ENTITY_TYPES')

        if (this.entityTypes) {
            this.schema = Object.values(this.entityTypes).reduce((map, item) => {

                if (item.driver.id) {
                    if (!map['id'][item.driver.engine]) {
                        map['id'][item.driver.engine] = {}
                    }
                    map['id'][item.driver.engine][item.driver.id] = item
                }

                if (item.driver.code) {
                    if (!map['code'][item.driver.engine]) {
                        map['code'][item.driver.engine] = {}
                    }
                    map['code'][item.driver.engine][item.driver.code] = item
                }

                if (item.driver.role) {
                    if (!map.role[item.driver.role]) {
                        map.role[item.driver.role] = []
                    }
                    map.role[item.driver.role].push(item)
                }

                return map
            }, {
                id: {},
                code: {},
                role: {
                },
            })
        }

    }

    getEntityTypesIndexed(driver, indexBy = 'id') {
        return this.schema[indexBy][driver]
    }

    getEntityType(driver, val, by = 'id') {
        return this.schema[by][driver][val]
    }

    getEntityTypesByRole(role) {
        return this.schema.role[role] || []
    }

    getIblockRouter(entityTypeInfo) {

        const iblockId = entityTypeInfo.driver.id
        const iblockCode = entityTypeInfo.driver.code
        const iblockKey = iblockCode || iblockId

        const sectionsPathsPattern = this.iblockSections[iblockId] ? this.iblockSections[iblockId].join('|') : '---'

        const urlReplaces = {
            'SITE_DIR': '',
            'IBLOCK_ID': ':iblockId',
            'ELEMENT_ID': ':elementId(\d+)',
            'ELEMENT_CODE': ':elementCode',
            'SECTION_CODE': ':sectionCode',
            'SECTION_ID': ':sectionId(\d+)',
            'SECTION_CODE_PATH': ':sectionPath(' + sectionsPathsPattern + ')'
        }

        const urlTemplates = entityTypeInfo.scopes.public.url

        const urls = {
            index: urlTemplates.index,
            section: urlTemplates.section,
            detail: urlTemplates.view,
        }

        for (const [key, value] of Object.entries(urls)) {

            if (!value)
                continue;

            urls[key] = value.replace(
                /#(\w+?)#/g,
                function (m, key) {
                    return urlReplaces[key]
                }
            );
        }

        return {
            urls,
            key: iblockKey,
            id: iblockId
        }
    }
}
