import {prop} from "@typegoose/typegoose";
import {EduEntityModel} from "~modules/edu-org/model/edu-entity-model";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";
import {EduSourceModel} from "~modules/edu-org/modules/source/core/model";
import {EduFobModel} from "~modules/edu-org/modules/fob/core/model";
import {AbitWorkplaceEnum} from "~modules/edu-org/enum/source-workplace";
import {EduSubjectModel} from "~modules/edu-org/modules/subject/core/model";
import {BaseModel} from "~lib/db/typegoose/base.model";
import {AppStatusEnum, appStatusListById} from "~modules/edu-org/modules/abit/core/app/enum";
import {EduCompetitionModel} from "~modules/edu-org/modules/competition/core/model";
import {AbitTestPassingTypeEnum} from "~modules/edu-org/modules/abit/core/test/enum";

export class EduAisEntrantRef {
    @prop({cfilter: true})
    id: number

    @prop({cfilter: true})
    state: number

    @prop({cfilter: true})
    status: string

    @prop({cfilter: true})
    appExists: boolean

    @prop({cfilter: true})
    priority: number

    @prop({cfilter: true})
    agreement: boolean

}

export class ItemApplicationEpgu {

    @prop({cfilter: true})
    uid: string

    @prop({cfilter: true})
    epguUid: number

    @prop({cfilter: true})
    status: number

    @prop({cfilter: true})
    statusName: string

    @prop({cfilter: true})
    agreement: boolean

    @prop({cfilter: true})
    agreementDate: Date

    @prop({cfilter: true})
    deny: boolean

    @prop({cfilter: true})
    denyDate: Date

    @prop({cfilter: true})
    createSource: string
}

export class AisCompetitionGroup {

    _id: Number | string

    @prop({cfilter: true})
    competitionId: number

    @prop({cfilter: true})
    competitionUid: string

    @prop()
    statusId: AppStatusEnum


    @prop({cfilter: true})
    cadmission: number

    @prop({cfilter: true})
    csource: number

    @prop({cfilter: true})
    cfob: number

    @prop()
    ord: number

    @prop()
    cset: number

    @prop()
    cpriemcat: number

    @prop({cfilter: true, default: {}})
    epgu: ItemApplicationEpgu


    /* VIRTUALS */
    @prop({ref: () => EduCompetitionModel, localField: "competitionId", foreignField: "id", justOne: true})
    competition?: EduCompetitionModel

    @prop({ref: () => EduAdmissionModel, localField: "cadmission", foreignField: "id", justOne: true})
    admission?: EduAdmissionModel

    @prop({ref: () => EduSourceModel, localField: "csource", foreignField: "id", justOne: true})
    source?: EduSourceModel

    @prop({ref: () => EduFobModel, localField: "cfob", foreignField: "id", justOne: true})
    fob?: EduFobModel


    /* /VIRTUALS */

    get statusInfo() {
        return appStatusListById[this.statusId]
    }

    get statusName() {
        return this.statusInfo.title
    }

    get priority() {
        return this.ord
    }

    get isBudget() {
        return this.csource !== 3
    }
}

export class ItemAchievements extends EduEntityModel {

    _id: Number | string

    @prop({cfilter: true})
    id: number

    @prop()
    cstud: number

    @prop()
    name: string

    @prop()
    cpriemachievement: number

    @prop()
    ball: number

}

export class DocSubject {

    @prop({})
    csubject: number

    @prop({})
    mark: number

    @prop({cfilter: true})
    numege: string

    @prop({cfilter: true})
    verified: boolean

    @prop({cfilter: true})
    cresultSourceType: number

    @prop({cfilter: true})
    markdate: Date

    @prop({ref: EduSubjectModel, localField: "csubject", foreignField: "id", justOne: true})
    public subject?: EduSubjectModel


    get passingType() {
        switch (this.cresultSourceType) {
            case 1:
                return AbitTestPassingTypeEnum.EGE;
            case 2:
                return AbitTestPassingTypeEnum.INTERNAL;
            case 3:
                return AbitTestPassingTypeEnum.OLIMP;
            case 4:
                return AbitTestPassingTypeEnum.GIA;
        }
    }
}

export class DocEpgu extends BaseModel {

    @prop({})
    uid: string

    @prop({})
    guid: string

    @prop({})
    prevGuid: string

    @prop({})
    guidChanged: boolean

    @prop({cfilter: true})
    onEpgu: boolean

    @prop({cfilter: true})
    fetched: boolean

    @prop({cfilter: true, _id: false})
    state: object

    @prop({cfilter: true, _id: false})
    identUid: string

    @prop({cfilter: true, _id: false})
    eduUid: string

    getUid() {
        return this.uid || this.getParent().personCode
    }

    getIdEntrantChoice() {
        const guid = this.guid
        const snils = this.getParent().getSnils()
        if (guid) {
            return {Guid: guid}
        } else if (snils) {
            return {Snils: snils}
        }
    }
}
