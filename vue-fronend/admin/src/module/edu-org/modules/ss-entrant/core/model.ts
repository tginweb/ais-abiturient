import {modelOptions, plugin, pre, prop, Ref} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {ObjectID} from "mongodb";
import {EduEntityModel} from "~modules/edu-org/model/edu-entity-model";
import {EduSSEntrantEpguDoc} from "./model/epgu-doc";
import {EduAisEntrantModel} from "~modules/edu-org/modules/ais-entrant/model";
import {EduSSAppModel} from "~modules/edu-org/modules/ss-app/core/model";
import {EduInstituteModel} from "~modules/edu-org/modules/institute/core";
import {UserModel} from "~modules/user/core/model/user.model";
import {abitOrderStatusList} from "~modules/edu-org/modules/abit/core/order/statics/status";

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
@modelOptions({schemaOptions: {collection: "edu_ss_entrant"}})
@pre<EduSSEntrantModel>('save', function () {

})
export class EduSSEntrantModel extends EduEntityModel {

    _id: ObjectID

    @prop({cfilter: true})
    id: number

    @prop({cfilter: true})
    epguId: number

    @prop({cfilter: true})
    fio: string

    @prop({cfilter: true})
    snils: string

    @prop({cfilter: true})
    egeRes: object

    @prop({type: EduSSEntrantEpguDoc})
    epguDocs: EduSSEntrantEpguDoc[]

    @prop({cfilter: true})
    cfac: number

    @prop({cfilter: true})
    changedEpgu: boolean

    @prop({cfilter: true})
    changedAis: boolean

    @prop({cfilter: true})
    fieldsJson: string

    @prop({cfilter: true})
    dateRegister: Date

    @prop({cfilter: true})
    coperator?: string

    @prop({cfilter: true})
    status: string

    @prop({cfilter: true})
    comments: object

    @prop({cfilter: true})
    haveExams: boolean

    @prop({cfilter: true})
    createSource: string

    @prop({ref: EduInstituteModel, localField: "cfac", foreignField: "id", justOne: true})
    fac?: Ref<EduInstituteModel>;

    @prop({ref: UserModel, localField: "coperator", foreignField: "_id", justOne: true})
    operator?: Ref<UserModel>



    public get entityType() {
        return 'edu_ss_entrant'
    }

    async epguExchange(taskId, action, scope = 'self', ids = '*') {

        console.log(scope + '.' + action)

        switch (scope + '.' + action) {

            case 'apps.calcFac': {

                const aisEntrant: EduAisEntrantModel = await this.context.entityService.findOne('edu_ais_entrant', {
                    snils: this.snils,
                    state: 2
                })

                if (aisEntrant && aisEntrant.apps.length) {
                    const app = aisEntrant.apps.sort((a, b) => ((a.ord > b.ord) ? 1 : -1))[0]

                    const admission = await this.context.entityService.findOne('edu_admission', {id: app.cadmission})

                    if (admission) {
                        this.cfac = admission.cfac
                        await this.savePromise()
                    }
                }
            }
                break

            case 'apps.export.status.accepted':

                const ssApps: [EduSSAppModel] = await this.context.entityService.find('edu_ss_app', {
                    snils: this.snils,
                })

                const aisEntrant: EduAisEntrantModel = await this.context.entityService.findOne('edu_ais_entrant', {
                    snils: this.snils,
                    state: 2
                })

                if (aisEntrant) {

                    const aisAppsByCompetition = aisEntrant.apps.reduce((map, app) => (map[app.cadmission + '.' + app.csource] = app, map), {})

                    for (const ssApp of ssApps) {

                        const competition = ssApp.cadmission + '.' + ssApp.csource

                        const aisApp = aisAppsByCompetition[competition]

                        if (aisApp) {
                            if (ssApp.cstatus !== 8) {
                                await this.epguDocAction(taskId, 'editApplicationStatusList', 'add', action, ssApp, scope)
                            }
                        }
                    }
                }


                break

            case 'docs.import':

                for (let doc of this.epguDocs) {

                    if (doc.doc.date || doc.fileId) {
                        continue
                    }

                    if (doc.type === 'ident') {
                        //   await this.epguDocAction(taskId, 'identification', 'get', action, doc, scope)
                    } else if (doc.type === 'education') {
                        //   await this.epguDocAction(taskId, 'document', 'get', action, doc, scope)
                    } else if (doc.type === 'achievement') {
                        await this.epguDocAction(taskId, 'appAchievement', 'get', action, doc, scope)
                    }
                }

                break


        }
    }

    async importApp(app: EduSSAppModel) {

        console.log('dd')

        const serviceApp: any = app.epguData

        let docsByType = {}

        let docsAll = []

        if (serviceApp.Documents) {

            for (let [group, value] of Object.entries(serviceApp.Documents)) {

                if (!value) continue

                let groupCode

                switch (group) {
                    case 'Identification':
                        groupCode = 'ident'
                        break
                    case 'Educations':
                        groupCode = 'education'
                        break
                    default:
                        groupCode = group
                }

                const docs = !Array.isArray(value) ? [value] : value

                for (const doc of docs) {
                    if (doc && doc.IDChoice && doc.IDChoice.UIDEpgu) {
                        if (!docsByType[groupCode]) {
                            docsByType[groupCode] = []
                        }

                        docsByType[groupCode].push({
                            type: groupCode,
                            UIDEpgu: doc.IDChoice.UIDEpgu
                        })
                    }
                }
            }

        }

        if (serviceApp.AppAchievementList && serviceApp.AppAchievementList.AppAchievement) {

            const docs = !Array.isArray(serviceApp.AppAchievementList.AppAchievement) ? [serviceApp.AppAchievementList.AppAchievement] : serviceApp.AppAchievementList.AppAchievement

            for (const doc of docs) {

                if (doc && doc.AppAchievementUidChoice && doc.AppAchievementUidChoice.UidEpgu) {

                    if (!docsByType['achievements']) {
                        docsByType['achievements'] = []
                    }

                    docsByType['achievements'].push({
                        type: 'achievement',
                        name: doc.Name,
                        UIDEpgu: doc.AppAchievementUidChoice.UidEpgu,
                    })
                }
            }
        }

        let group, docs: any

        for ([group, docs] of Object.entries(docsByType)) {

            for (const doc of docs) {
                docsAll.push(doc)
            }
        }

        for (const doc of docsAll) {

            let sdoc = this.epguDocs.find(item => item.type === doc.type && item.UIDEpgu === doc.UIDEpgu)

            if (!sdoc) {
                sdoc = <EduSSEntrantEpguDoc>{
                    id: this.epguDocs.length + 1,
                    type: doc.type,
                    UIDEpgu: doc.UIDEpgu,
                    doc: {}
                }
            }

            sdoc.appUIDEpgu = app.epguId

            if (doc.name)
                sdoc.doc.name = doc.name

            if (!sdoc._id) {
                this.epguDocs.push(sdoc)
            }

        }

        await this.savePromise()
    }

    async getAdminActions(user) {

        const result = []

        result.push({
            name: 'view',
            label: 'Просмотр',
            icon: 'fasEye',
            listEvent: 'open',
            type: 'vrouter',
            path: '/admin/edu-epgu/ss-entrant/' + this.id + '/view',
            rowRoot: true,
            access: true
        })

        if (!this.coperator) {
            result.push({
                name: 'take',
                label: 'Взять в работу',
                type: 'vrouter',
                path: '/admin/edu-epgu/ss-entrant/' + this.id + '/operator-take',
                access: true
            })
        }

        result.push({
            name: 'epgu_send_status',
            label: 'Отправить статус',
            type: 'dispatch',
            path: 'edu_ss_entrant/entityActionMultiple',
            args: {
                action: 'epgu_status_send'
            },
            group: true,
            access: true
        })

        return result.filter(item => {

            if (item.roles && item.roles.length && !item.roles.filter(value => user.roles.includes(value)).length) return false

            return item.access
        })
    }

    async epguMessageApplyState(message, doc, save = true) {

        const type = message.header.entityType + '.' + message.entityAction

        console.log(type)

        if (message.isResultSuccess()) {

            let mentity,
                epdoc: EduSSEntrantEpguDoc,
                dateParts

            switch (type) {

                case 'identification.import':

                    mentity = message.response.payload.Identification

                    epdoc = doc
                    epdoc.epguData = mentity

                    epdoc.doc.organization = mentity.DocOrganization
                    epdoc.doc.date = mentity.IssueDate
                    epdoc.doc.serial = mentity.DocSeries
                    epdoc.doc.number = mentity.DocNumber
                    epdoc.doc.subcode = mentity.SubdivisionCode
                    epdoc.doc.checked = mentity.Checked

                    if (epdoc.doc.date) {
                        dateParts = epdoc.doc.date.split('-')
                        epdoc.doc.date = dateParts.reverse().join('.')
                    }

                    if (message.response.fileId)
                        epdoc.fileId = message.response.fileId

                    break

                case 'document.import':

                    mentity = message.response.payload.Document
                    epdoc = doc
                    epdoc.epguData = mentity

                    epdoc.doc.name = mentity.Name
                    epdoc.doc.organization = mentity.IssueOrg
                    epdoc.doc.date = mentity.IssueDate
                    epdoc.doc.serial = mentity.Series
                    epdoc.doc.number = mentity.Number
                    epdoc.doc.checked = mentity.Checked

                    if (epdoc.doc.date) {
                        dateParts = epdoc.doc.date.split('-')
                        epdoc.doc.date = dateParts.reverse().join('.')
                    }

                    if (message.response.fileId)
                        epdoc.fileId = message.response.fileId

                    break

                case 'appAchievement.import':

                    mentity = message.response.payload.AppAchievement
                    epdoc = doc

                    if (message.response.fileId)
                        epdoc.fileId = message.response.fileId

                    epdoc.IDCategory = mentity.IDCategory

                    break

            }
        }

        await super.epguMessageApplyState(message, doc, save)
    }

    get statusInfo() {
        return abitOrderStatusList[this.status]
    }

}
