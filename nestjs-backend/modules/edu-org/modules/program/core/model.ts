import {modelOptions, plugin, pre, prop, Ref} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {EduDirectionModel} from "~modules/edu-org/modules/direction/core/model";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";
import {EduFobModel} from "~modules/edu-org/modules/fob/core/model";
import {ObjectID} from "mongodb";
import {EduEntityModel} from "~modules/edu-org/model/edu-entity-model";

const autoincrement = require('simple-mongoose-autoincrement');

@plugin(paginationPlugin, {
    defaultSortField: 'id',
    defaultSortAscending: false,
    views: {
        public: [
            '_id',
            'id',
            'uid',
            'yr',
            'name',
            'cadmission',
            'cdirection',
            'cfob'
        ],
    }
})
@plugin(autoincrement, {field: 'id'})
@plugin(require('mongoose-named-scopes'))
@modelOptions({schemaOptions: {collection: "edu_program"}})
@pre<EduProgramModel>('save', function () {
    this.uid = [this.cadmission].join('.')
})
export class EduProgramModel extends EduEntityModel {

    _id: ObjectID

    @prop({cfilter: true})
    id: number

    @prop({cfilter: true})
    uid: string

    @prop({cfilter: true})
    yr: number

    @prop({})
    name: string

    @prop({})
    cadmission: number

    @prop({})
    cdirection: number

    @prop({})
    cfob: number


    @prop({ref: EduAdmissionModel, localField: "cadmission", foreignField: "id", justOne: true})
    public admission?: Ref<EduAdmissionModel>;

    @prop({ref: EduFobModel, localField: "cfob", foreignField: "id", justOne: true})
    public fob?: Ref<EduFobModel>;

    @prop({ref: EduDirectionModel, localField: "cdirection", foreignField: "id", justOne: true})
    public direction?: Ref<EduDirectionModel>;

    public get entityType() {
        return 'edu_program'
    }

    async epguExchange(taskId, action, scope = 'self', ids = '*') {

        console.log([taskId, action, scope, ids])

        switch (scope) {
            case 'self':
                await this.epguDocAction(taskId, 'educationProgram', action, this, scope)
                break;
        }

    }

    async epguPacket_educationProgram_sync(entity) {

        let data = {}
        data['UID'] = entity.uid
        data['Name'] = this.name
        data['IDEducationForm'] = await this.context.epguDictionaryService.getTermIdByAis('EducationForm', this.cfob)
        data['IDOCSO'] = entity.direction ? await this.context.epguDictionaryService.getTermIdByOkso(this.direction['cod']) : null
        return {
            'EducationProgram': data
        }
    }

}
