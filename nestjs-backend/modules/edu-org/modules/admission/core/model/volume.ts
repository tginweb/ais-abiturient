import {prop, Ref} from "@typegoose/typegoose";
import {BaseModel} from '~lib/db/typegoose/base.model'
import {EduSourceModel} from "~modules/edu-org/modules/source/core/model";
import {EduCompetitionTestModel} from "./competion-test";

export class EduAdmissionCompetitionModel extends BaseModel {

    @prop({cfilter: true})
    id: number

    @prop({})
    uid: string

    @prop({})
    name: string

    @prop({})
    csource: number

    @prop({})
    admissionNumber: number

    @prop({ref: EduSourceModel, localField: "csource", foreignField: "id", justOne: true})
    public source?: Ref<EduSourceModel>

    @prop({type: EduCompetitionTestModel})
    public entranceTests?: EduCompetitionTestModel[]

    public get adminUrl() {
        return '/admin/edu/admission.competition/' + this.id + '/view'
    }

    getActions() {
        const result = []

        result.push({
            label: 'Просмотр',
            listEvent: 'open',
            type: 'vrouter',
            path: this.adminUrl
        })

        return result
    }

    recieveMessage(message) {

    }
}
