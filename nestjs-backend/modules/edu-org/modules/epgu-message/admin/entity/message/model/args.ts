import {prop} from "@typegoose/typegoose";

export class DocArgs {
    @prop({})
    entityType: string

    @prop({})
    entityId: string

    @prop({})
    entityIds: string[]

    @prop({})
    entityNid: number

    @prop({})
    entityTitle: string

    @prop({})
    orderId: string

    @prop({})
    orderNid: number

    @prop({})
    uidEpgu: number

    @prop({})
    statusId: number

    @prop({})
    snils: string

    @prop({})
    guid: string

    @prop({})
    guids: string[]

    @prop({})
    app: object

    @prop({})
    appId: string

    @prop({default: {}})
    params: object
}
