import {arrayProp, modelOptions, plugin, prop, Ref} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {BaseModel} from '~lib/db/typegoose/base.model'
import {ObjectID} from "mongodb";
const autoincrement = require('simple-mongoose-autoincrement')

@plugin(paginationPlugin, {
    defaultSortField: 'id',
    defaultSortAscending: false,
    views: {
        public: [
            '_id',
            'nid',
            'passportSer',
            'passportNum',
            'firstName',
            'lastName',
            'secondName',
            'subjectName',
            'csubject',
            'mark',
            'date',
            'dateStr',
        ],
    }
})
@plugin(require('mongoose-named-scopes'))
@plugin(autoincrement, {field: 'nid'})
@modelOptions({schemaOptions: {
    collection: "edu_ege",
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
}})
export class EduEgeModel extends BaseModel {

    _id: ObjectID;

    @prop({cfilter: true})
    nid: number

    @prop({})
    passportSer: string;

    @prop({})
    passportNum: string;

    @prop({})
    firstName: string

    @prop({})
    lastName: string

    @prop({})
    secondName: string

    @prop({})
    subjectName: string

    @prop({})
    csubject: number

    @prop({})
    mark: number

    @prop({})
    dateStr: string

    @prop({})
    date: Date

    @prop({})
    orderId: string[]

    @prop({})
    orderNid: number[]

    get id() {
        return this._id.toString()
    }

    get year() {
        return (this.dateStr || '').split('.')[2]
    }

    get hash() {
        return [
            this.passportSer,
            this.passportNum,
            this.lastName,
            this.firstName,
            this.secondName
        ].join('.')
    }

    get fio() {
        return [
            this.lastName,
            this.firstName,
            this.secondName
        ].join(' ')
    }
}
