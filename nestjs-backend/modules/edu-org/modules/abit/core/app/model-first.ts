import {arrayProp, prop} from "@typegoose/typegoose";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";

import {AbitAppModelAis} from "./subdoc/ais";
import {AbitAppModelEpgu} from "./subdoc/epgu";
import {BaseModel} from "~lib/db/typegoose/base.model";
import {AbitWorkplaceEnum, AbitWorkplaceMap} from "~modules/edu-org/enum/source-workplace";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";
import {AppStatusEnum, appStatusListById} from "~modules/edu-org/modules/abit/core/app/enum";
import {AbitAppModelContext} from "./model-context"
import {AbitAppModelAction} from "~modules/edu-org/modules/abit/core/app/subdoc/action";
import {EduCompetitionModel} from "~modules/edu-org/modules/competition/core/model";
import {EduInstituteModel} from "~modules/edu-org/modules/institute/core/model";
import {AbitAppModelLk} from "~modules/edu-org/modules/abit/core/app/subdoc/lk";


export class AbitFirstAppModel extends BaseModel {

    _id: Number | string

    @prop({cfilter: true})
    nid: number

    @prop({cfilter: true})
    appGroupId: string

    @prop({cfilter: true})
    orderId: string

    @prop({cfilter: true})
    orderNid: number

    @prop({cfilter: true})
    fio: string

    @prop({cfilter: true})
    snils: string

    @prop({cfilter: true})
    clevel: number

    @prop({cfilter: true})
    cfac: number

    @prop({
        default: 0
    })
    priority: number

    @prop({
        default: 0
    })
    priorityTarget: number


    @prop({cfilter: true})
    competitionId: number

    @prop({cfilter: true})
    competitionUid: string


    @prop({cfilter: true})
    cadmission: number

    @prop({cfilter: true})
    csource: number


    @prop({cfilter: true})
    cfob: number

    @arrayProp({items: Number})
    specs: number[]

    @prop()
    createSource: AbitWorkplaceEnum

    @prop()
    createUserId: string

    @prop({cfilter: true})
    statusId: AppStatusEnum

    @prop()
    statusMessage: string

    @prop()
    cancelSource: AbitWorkplaceEnum

    @prop()
    cancelAt: Date

    @prop({cfilter: true})
    registerAt?: Date

    @arrayProp({items: AbitAppModelAction})
    history: AbitAppModelAction[]

    @prop({_id: false, default: {}})
    ais: AbitAppModelAis

    @prop({_id: false, default: {}})
    epgu: AbitAppModelEpgu

    @prop({_id: false, default: {}})
    lk: AbitAppModelLk

    createAt: Date
    updateAt: Date

    /* VIRTUALS */

    @prop({ref: () => EduCompetitionModel, localField: "competitionId", foreignField: "id", justOne: true})
    competition?: EduCompetitionModel

    @prop({ref: () => EduAdmissionModel, localField: "specs", foreignField: "id", justOne: false})
    specsAdmissions?: EduAdmissionModel

    @prop({ref: () => AbitOrderModel, localField: "orderId", foreignField: "_id", justOne: true})
    order?: AbitOrderModel

    @prop({ref: () => EduInstituteModel, localField: "cfac", foreignField: "id", justOne: true})
    fac?: EduInstituteModel

    public orderFetched: Boolean
    public competitionFetched: Boolean

    public context: AbitAppModelContext = {}

    public getService() {
        return this.context && this.context.service
    }

    public get id() {
        return this._id.toString()
    }

    get createSourceTitle() {
        return AbitWorkplaceMap[this.createSource] && AbitWorkplaceMap[this.createSource].title
    }

    get isCanceled() {
        return appStatusListById[this.statusId] ? appStatusListById[this.statusId].canceled : null
    }

    get statusTitle() {
        return appStatusListById[this.statusId] ? appStatusListById[this.statusId].title : null
    }

    get status() {
        return appStatusListById[this.statusId]
    }

    getDebugData() {
        return {
            nid: this.nid,
            orderId: this.orderId,

        }
    }

}
