import {modelOptions, plugin, pre, prop} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {ObjectID} from "mongodb";
import {EduEntityModel} from "~modules/edu-org/model/edu-entity-model";
import {EduRatingModelContext} from "~modules/edu-org/modules/rating/core/model-context";
import {promisify} from "util";
import * as fs from 'fs'

const path = require('path')
const readFile = promisify(fs.readFile)

const autoincrement = require('simple-mongoose-autoincrement');
const dayjs = require('dayjs')

@plugin(paginationPlugin, {
    defaultSortField: 'id',
    defaultSortAscending: false,
    views: {
        public: [
            '_id',
            'id',
            'nid',
            'name',
            'createAt',
            'generateStartAt',
            'generateEndAt',
            'actual'
        ],
    }
})
@plugin(autoincrement, {field: 'nid'})
@plugin(require('mongoose-named-scopes'))
@modelOptions({schemaOptions: {collection: "edu_rating"}})
@pre<EduRatingModel>('save', function () {

})
export class EduRatingModel extends EduEntityModel {

    _id: ObjectID

    @prop({cfilter: true})
    nid: number

    @prop({cfilter: true})
    generateStartAt: Date

    @prop({cfilter: true})
    generateEndAt: Date

    @prop({cfilter: true})
    actual: Boolean

    createAt: Date
    updateAt: Date


    public context: EduRatingModelContext = {}

    public get entityType() {
        return 'edu_rating'
    }

    getService() {
        return this.context && this.context.service
    }

    async getAdminActions(user) {

        const result = []

        result.push({
            name: 'view',
            label: 'Просмотр',
            icon: 'fasEye',
            listEvent: 'open',
            type: 'vrouter',
            rowRoot: true,
            path: '/admin/edu/rating/' + this._id + '/edit',
            access: true
        })

        result.push({
            label: 'Удалить',
            confirm: true,
            icon: 'delete',
            type: 'dispatch',
            path: 'edu_rating/actionMultiple',
            argsIdMultiple: true,
            args: {
                action: 'delete'
            }
        })

        result.push({
            label: 'Сделать актуальным',
            confirm: true,
            type: 'dispatch',
            path: 'edu_rating/makeActual',
            args: {
            }
        })

        return result
    }

    get id() {
        return this._id.toString()
    }

    get name() {
        return 'Список №' + this.nid +  ' ' + dayjs(this.createAt).format('DD.MM.YYYY HH:mm')
    }

    get dataFileName() {
        return this.nid + '.json'
    }

    get dataFilePath() {
        return path.join(process.cwd(), '/ratings/' + this.dataFileName)
    }

    get generateAvailable() {
        return !this.generateEndAt
    }

    get generated() {
        return !!this.generateEndAt
    }

    get generateTime() {
        if (this.generateStartAt) {
            const dateGenerateStartAt = dayjs(this.generateStartAt);
            const dateNow = this.generateEndAt ? dayjs(this.generateEndAt) : dayjs()
            return dateNow.diff(dateGenerateStartAt, 'seconds');
        }
        return 0
    }

    get generateProcess() {
        return this.generateStartAt && !this.generateEndAt && (this.generateTime < 1000)
    }

    async loadDataFile() {
        try {
            await fs.promises.access(this.dataFilePath)
            const rows = JSON.parse(await readFile(this.dataFilePath, 'utf8'));
            return rows
        } catch {
            return []
        }
    }
}
