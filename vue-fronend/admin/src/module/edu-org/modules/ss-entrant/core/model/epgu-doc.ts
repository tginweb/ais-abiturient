import {prop, Ref} from "@typegoose/typegoose";
import {ObjectID} from "mongodb";
import {EduEntityModel} from "~modules/edu-org/model/edu-entity-model";
import {FileModel} from "~modules/file/core";
import {EduSSEntrantDoc} from "./doc";
import {EduEpguDictionaryModel} from "~modules/edu-org/modules/epgu-dictionary/core/model";

export class EduSSEntrantEpguDoc extends EduEntityModel {

    _id: ObjectID

    @prop()
    id: number

    @prop({cfilter: true, default: false})
    attached: boolean

    @prop({cfilter: true})
    type: string

    @prop()
    UIDEpgu: number

    @prop()
    IDCategory: number

    @prop()
    appUIDEpgu: number

    @prop()
    appId: number

    @prop({_id: false, default: {}})
    doc: EduSSEntrantDoc

    @prop({_id: false, default: {}})
    epguData: object


    @prop({})
    IDCategoryAchievement: number

    @prop({cfilter: true})
    fileId: string

    @prop({ref: () => FileModel, localField: "fileId", foreignField: "_id"})
    file: Ref<FileModel>[];

    @prop({
        ref: EduEpguDictionaryModel,
        localField: "IDCategory",
        foreignField: "id",
        match: {taxonomy: 'AchievementCategory'},
        justOne: true
    })
    category?: Ref<EduEpguDictionaryModel>


    get subdocPath() {
        return 'edu_ss_entrant-epguDocs'
    }

    public get typeName() {
        return {
            'education': 'Документ об образовании',
            'ident': 'Документ удост. личность',
            'achievement': 'ИД',
        }[this.type]
    }
}
