import {prop} from "@typegoose/typegoose";
import {EduEntityModel} from '~modules/edu-org/model/edu-entity-model'

export class EduVolumeDistributionModel extends EduEntityModel {

    _id: string

    @prop({cfilter: true})
    id: number

    @prop({})
    uid: string

    @prop({})
    name?: string

    @prop({})
    clevelBudget?: number

    @prop({})
    budgetO: number

    @prop({})
    budgetOZ: number

    @prop({})
    budgetZ: number

    @prop({})
    quotaO: number

    @prop({})
    quotaOZ: number

    @prop({})
    quotaZ: number

    @prop({})
    targetO: number

    @prop({})
    targetOZ: number

    @prop({})
    targetZ: number

    @prop({})
    paidO: number

    @prop({})
    paidOZ: number

    @prop({})
    paidZ: number

    get subdocPath() {
        return 'edu_volume.distribution'
    }

    getActions() {
        const result = []

        result.push({
            label: 'Просмотр',
            listEvent: 'open',
            type: 'vrouter',
        })

        return result
    }

    getTreeNode() {
        return {
            key: this.getSubdocPathId(),
            id: this.id,
            label: this.name,
        }
    }
}
