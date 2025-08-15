import {Injectable} from '@nestjs/common';
import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper";
import {BaseModel} from "~lib/db/typegoose/base.model";


@Injectable()
export class EntityService {

    public entityTypes = {}

    constructor() {

    }

    registerEntityType(name, info) {
        this.entityTypes[name] = {
            ...(this.entityTypes[name] || {}),
            ...info
        }
    }

    entityTypeAddContext(name, context) {
        this.entityTypes[name].context = {
            ...this.entityTypes[name].context || {},
            ...context
        }
    }

    entityAddContext(entity, entityType?) {
        entityType = entityType || entity.entityType

        if (entityType && this.entityTypes[entityType] && this.entityTypes[entityType].context) {
            entity.addContext(this.entityTypes[entityType].context)
        }
    }

    async create(entityType, data) {
        if (this.entityTypes[entityType]) {
            return await this.entityTypes[entityType].create(data)
        }
    }

    adminService(entityType) {
        return this.entityTypes[entityType]['adminService']
    }

    service(entityType) {
        return this.entityTypes[entityType]['service']
    }

    query(entityType): MongooseQueryWrapper<BaseModel> {
        return this.entityTypes[entityType] ? this.entityTypes[entityType].query() : null
    }

    model(entityType): any {
        return this.entityTypes[entityType] ? this.entityTypes[entityType].model : null
    }

    async find(entityType, filter: any = null, nav: any = null, view = 'public') {
        if (this.entityTypes[entityType]) {
            return await this.entityTypes[entityType].find(filter)
        } else {
            return []
        }
    }

    async findOne(entityType, filter: any = null, nav: any = null, view = 'public') {
        if (this.entityTypes[entityType]) {
            return await this.entityTypes[entityType].findOne(filter)
        }
    }

    async adminFindOne(entityType, filter: any = null, nav: any = null, view = 'public') {
        if (this.entityTypes[entityType]) {
            return await this.entityTypes[entityType].adminFindOne(filter)
        }
    }

    async findEntityTarget(target, id?) {

        const entityTarget = id ? target + ':' + id : target


        const [entityPath, entityIds] = entityTarget.split(':')

        const entityPathItems = entityPath.split('-')
        const entityIdsItems = entityIds.split('-')

        const entityType = entityPathItems.shift()
        const entityId = entityIdsItems.shift()

        const filter: any = {}

        if (entityId.toString().length > 10) {
            filter._id = entityId
        } else {
            filter.id = entityId
        }

        const entity = await this.findOne(entityType, filter)

        const res = {
            entity: entity,
            entityType: entityType,
            entityId: entityId,
            subType: entityPathItems.join('-'),
            subId: entityIdsItems.join('-'),
        }

        return res
    }

    async extractArgsId(arg) {
        const filter = this.getIdsFilter(arg)
        if (!filter)
            return false
        const key = Object.keys(filter)[0]
        return {
            by: key,
            id: filter[key]
        }
    }

    extractArgsIds(arg) {
        const filter = this.getIdsFilter(arg)
        if (!filter)
            return false
        const key = Object.keys(filter)[0]
        return {
            by: key,
            ids: !Array.isArray(filter[key]) ? [filter[key]] : filter[key]
        }
    }

    getIdsFilter(arg) {
        if (arg.nids && arg.nids.length) {
            return {nid: arg.nids}

        } else if (arg.nid) {
            return {nid: [arg.nid]}

        } else if (arg.ids && arg.ids.length) {
            return {id: arg.ids}

        } else if (arg.id) {
            return {id: [arg.id]}

        } else if (arg._ids && arg._ids.length) {
            return {_id: arg._ids}

        } else if (arg._id) {
            return {_id: [arg._id]}
        }

        return false
    }

    getEntityType(name, field, def = null) {
        if (this.entityTypes[name]) {
            return this.entityTypes[name][field]
        } else {
            return def
        }
    }
}
