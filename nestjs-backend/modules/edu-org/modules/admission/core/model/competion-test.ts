import {prop, Ref} from "@typegoose/typegoose";
import {EduSubjectModel} from "~modules/edu-org/modules/subject/core/model";
import {EduCompetitionTestLocationModel} from "./competion-test-location";
import {EduEntityModel} from '~modules/edu-org/model/edu-entity-model'
import {ObjectID} from "mongodb";

export class EduCompetitionTestModel extends EduEntityModel {

    _id: ObjectID

    @prop({cfilter: true})
    public id: number

    @prop({cfilter: true})
    public uid?: string

    @prop({cfilter: true})
    public name?: string

    @prop({cfilter: true})
    public csubject: number

    @prop()
    public minimal?: number

    @prop()
    public cexampasstype?: number

    @prop()
    public centertestType?: number

    @prop()
    public number?: number

    @prop()
    public priority?: number

    @prop()
    public optionalId: number


    @prop({type: EduCompetitionTestLocationModel})
    public locations?: EduCompetitionTestLocationModel[]


    @prop({ref: EduSubjectModel, localField: "csubject", foreignField: "id", justOne: true})
    public subject?: Ref<EduSubjectModel>


    get subdocPath() {
        return 'edu_admission.competition.test'
    }

    get isEge() {
        return this.subject['isege'] === 't'
    }

    get subjectId() {
        return this.subject['id']
    }

    get epguIDEntranceTestType() {
        if (this.id>=40) {
            return 5
        }
        if (this.isEge) {
            return 4
        }
        return 2
    }

    getTreeNode() {

        const children = []

        const locations = this.locations && this.locations.map(item => item.getTreeNode())

        if (locations && locations.length) {
            children.push({
                key: this.subdocPath + '.location' + ':' + this.getSubdocUid(this) + '.*',
                label: 'График',
                children: locations
            })
        }

        return {
            key: this.getSubdocPathId(),
            id: this.id,
            label: this.name,
            children: children
        }
    }

}
