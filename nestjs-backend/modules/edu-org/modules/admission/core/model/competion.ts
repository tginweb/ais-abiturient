import {prop, Ref} from "@typegoose/typegoose";
import {EduEntityModel} from '~modules/edu-org/model/edu-entity-model'
import {EduSourceModel} from "~modules/edu-org/modules/source/core/model";
import {EduCompetitionTestModel} from "./competion-test";
import {ObjectID} from "mongodb";
import {targetOrgsListById} from "~modules/edu-org/enum/target-orgs";

export class EduAdmissionCompetitionModel extends EduEntityModel {

    _id: ObjectID

    @prop({cfilter: true})
    id: number

    @prop({})
    uid: string

    @prop({})
    name?: string

    @prop({})
    celevOrg?: string

    @prop({})
    isdop?: boolean

    @prop({})
    csource: number

    @prop({})
    admissionNumber?: number

    @prop({ref: EduSourceModel, localField: "csource", foreignField: "id", justOne: true})
    source?: Ref<EduSourceModel>

    @prop({type: EduCompetitionTestModel})
    tests?: EduCompetitionTestModel[]


    public get targetOrgData() {
        return this.celevOrg ? targetOrgsListById[this.celevOrg] : null
    }


    public get uidComp() {
        const competUid = this.celevOrg ? 'adm:' + this.id + '.' + this.csource + '-' + this.celevOrg : 'adm:' + this.id + '.' + this.csource
        return competUid
    }


    public get nameComp() {
        let res
        if (this.targetOrgData) {
            res = this.name + ', ' + this.targetOrgData.title
        } else {
            res = this.name
        }
        if (this.isdop) {
           // res += ', допнабор'
        }
        return res
    }

    public get adminUrl() {
        return '/admin/edu/admission.competition/' + this.id + '/view'
    }

    get subdocPath() {
        return 'edu_admission.competition'
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

    getTreeNode() {
        return {
            key: this.getSubdocPathId(),
            id: this.id,
            label: this.name,
            children: [
                {
                    key: this.subdocPath + '.test' + ':' + this.getSubdocUid(this) + '.*',
                    label: 'Испытания',
                    children: this.tests.map(item => item.getTreeNode())
                }
            ]
        }
    }
}
