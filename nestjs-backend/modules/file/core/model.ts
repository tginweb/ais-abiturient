import {modelOptions, plugin, prop} from "@typegoose/typegoose";
import {ObjectID} from "mongodb";

import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {BaseModel} from "~lib/db/typegoose/base.model";

const autoincrement = require('simple-mongoose-autoincrement');

@plugin(paginationPlugin, {
    defaultSortField: '_id',
    defaultSortAscending: false,
    views: {
        default: [],
        public: [],
    }
})
@plugin(require('mongoose-named-scopes'))
//@plugin(autoincrement, {field: 'nid'})
@modelOptions({schemaOptions: {collection: "file"}})
export class FileModel extends BaseModel {

    _id: ObjectID;

    @prop({cfilter: true})
    nid: number

    @prop({})
    mimetype: string

    @prop({})
    originalname: string

    @prop({})
    filename: string

    @prop({})
    filesize: number

    @prop({})
    relDocType: string

    @prop({})
    relDocId: string

    @prop({})
    relDocPath: string

    @prop({default: false})
    temporary: boolean

    @prop({default: false})
    deleted: boolean

    @prop({})
    name: string

    @prop()
    content: string

    public children: FileModel[]
    public depth: Number
    public parentId: Number

    public get downloadUrl() {
        return '/api/file/download?id=' + this._id
    }

    get id() {
        return this._id.toString()
    }


    getEpguTitle() {

    }

    getClientFields() {
        return {
            id: this._id,
            relDocType: this.relDocType,
            relDocId: this.relDocId,
            relDocPath: this.relDocPath,
            mimetype: this.mimetype,
            originalname: this.originalname,
            filesize: this.filesize,
            used: true,
            filename: this.filename
        }
    }


}
