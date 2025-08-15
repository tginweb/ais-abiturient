import {prop} from "@typegoose/typegoose";
import {ObjectID} from "mongodb";
import {EduEntityModel} from "~modules/edu-org/model/edu-entity-model";

export class EduCompetitionTestLocationModel extends EduEntityModel {

    _id: ObjectID

    @prop({cfilter: true})
    public id: number

    @prop({cfilter: true})
    public uid: string

    @prop({cfilter: true})
    public name: string

    @prop({cfilter: true})
    public date: Date

    @prop({cfilter: true})
    public place: string

    get subdocPath() {
        return 'edu_admission.competition.test.location'
    }

    getTreeNode() {
        return {
            key: this.getSubdocPathId(),
            id: this.id,
            label: this.name,
        }
    }
}
