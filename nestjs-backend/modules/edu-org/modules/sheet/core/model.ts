import {arrayProp, modelOptions, plugin, pre, prop} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {ObjectID} from "mongodb";
import {EduEntityModel} from "~modules/edu-org/model/edu-entity-model";
import {EduSheetModelContext} from "~modules/edu-org/modules/sheet/core/model-context";
import {AbitTestModel} from "~modules/edu-org/modules/abit/core/test/model";

const autoincrement = require('simple-mongoose-autoincrement');

export class EduSheetTest {
    @prop({cfilter: true})
    testId: string

    @prop({cfilter: true})
    ball: number

    @prop({ref: () => AbitTestModel, localField: "testId", foreignField: "_id", justOne: true})
    test?: AbitTestModel;
}

@plugin(paginationPlugin, {
    defaultSortField: 'id',
    defaultSortAscending: false,
    views: {
        public: [
            '_id',
            'id',
            'nid',
            'name',
            'excelText',
            'tests'
        ],
    }
})
@plugin(autoincrement, {field: 'nid'})
@plugin(require('mongoose-named-scopes'))
@modelOptions({schemaOptions: {collection: "edu_sheet"}})
@pre<EduSheetModel>('save', function () {

})
export class EduSheetModel extends EduEntityModel {

    _id: ObjectID

    @prop({cfilter: true})
    nid: number

    @prop({cfilter: true})
    name: string


    @prop({cfilter: true})
    excelText: string


    @arrayProp({items: EduSheetTest, default: []})
    tests: EduSheetTest[]

    /* VIRTUALS */

    /* /VIRTUALS */

    public context: EduSheetModelContext = {}

    public get entityType() {
        return 'edu_sheet'
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
            path: '/admin/edu/sheet/' + this._id + '/edit',
            access: true
        })

        return result
    }
}
