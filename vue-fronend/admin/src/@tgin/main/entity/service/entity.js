import {deepGet} from '../../common/lib/util/base'

export default class {

    constructor(ctx, vars) {
        this.ctx = ctx
        this.vars = vars || {}
    }

    getAdminUrl(entityType, entity, action, scope = 'admin') {
        return this.getUrl(entityType, entity, action, scope)
    }

    getPublicUrl(entityType, entity, action, scope = 'public') {
        return this.getUrl(entityType, entity, action, scope)
    }

    getUrl(entityType, entity, action, scope) {

        action = action || 'view'

        const typeInfo = this.ctx.store.state.entity.app.typesInfo[entityType]

        let tpl = ''

        if (typeInfo) {
            tpl = typeInfo[scope]['url'][action]

            const vars = {
                ...this.ctx.store.getters['settings/all'],
                ENTITY: entity
            }

            if (tpl) {
                tpl = tpl.replace(
                    /{([\w\d\.]*)}/g,
                    (m, key) => {
                        return deepGet(vars, key)
                    }
                )
            }
        }

        return tpl
    }
}
