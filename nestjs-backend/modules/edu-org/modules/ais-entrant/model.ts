import {modelOptions, plugin, pre, prop, Ref} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {ObjectID} from "mongodb";
import {EduEntityModel} from "~modules/edu-org/model/edu-entity-model";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";
import {EduSourceModel} from "~modules/edu-org/modules/source/core/model";
import {aisStudentStatusById} from "~modules/edu-org/enum/ais-student-status";

import {AisCompetitionGroup, DocEpgu, DocSubject, ItemAchievements} from './subdoc/all'

@plugin(paginationPlugin, {
    defaultSortField: 'id',
    defaultSortAscending: false,
    views: {
        public: [
            '_id',
            'id',
            'state'
        ],
    }
})
@plugin(require('mongoose-named-scopes'))
@modelOptions({schemaOptions: {collection: "edu_ais_entrant", toJSON: {virtuals: true}, toObject: {virtuals: true}}})
@pre<EduAisEntrantModel>('save', function () {

})
export class EduAisEntrantModel extends EduEntityModel {

    _id: ObjectID

    @prop({cfilter: true})
    id: number

    @prop({cfilter: true})
    eduType: number

    @prop({cfilter: true, default: []})
    orderNid: number[]


    @prop({cfilter: true})
    lastName: string

    @prop({cfilter: true})
    firstName: string

    @prop({cfilter: true})
    secondName: string

    @prop({cfilter: true})
    phone: string

    @prop({cfilter: true})
    email: string


    @prop({cfilter: true, default: ''})
    snils: string

    @prop({cfilter: true, default: ''})
    inn: string

    @prop({cfilter: true, default: ''})
    passport_ser: string

    @prop({cfilter: true, default: ''})
    passport_num: string

    @prop({cfilter: true})
    cadmission: number

    @prop({cfilter: true})
    cabitrecadm: number


    @prop({cfilter: true})
    cset: number


    @prop({cfilter: true})
    csource: number

    @prop({cfilter: true})
    isdop: boolean

    @prop({cfilter: true})
    appldate: Date

    @prop({type: AisCompetitionGroup, default: []})
    apps: AisCompetitionGroup[]

    @prop({type: ItemAchievements, default: []})
    achievements: ItemAchievements[]

    @prop({cfilter: true})
    state: number

    @prop({cfilter: true})
    stateName: string


    @prop({cfilter: true})
    citem: number

    @prop({cfilter: true})
    changed: boolean


    @prop({cfilter: true, default: {}})
    data: object

    @prop({cfilter: true})
    clevel: number


    @prop({cfilter: true})
    onEpgu: boolean

    @prop({_id: false, default: {}})
    epgu: DocEpgu

    @prop({type: DocSubject, default: []})
    subjects: DocSubject[]


    /* VIRTUALS */

    @prop({ref: EduAdmissionModel, localField: "cadmission", foreignField: "id", justOne: true})
    admission?: Ref<EduAdmissionModel>;

    @prop({ref: () => EduSourceModel, localField: "csource", foreignField: "id", justOne: true})
    source?: EduSourceModel

    /* /VIRTUALS */

    get uid() {
        if (this.snilsReal) {
            return 'СНИЛС_' + this.snilsReal
        } else if (this.passport) {
            return 'ПАСПОРТ_' + this.passportReal
        } else {
            return 'ФИО_' + this.fio
        }
    }

    get stateStatusInfo() {
        return aisStudentStatusById[this.state]
    }

    get stateTitle() {
        const state = aisStudentStatusById[this.state]
        return state.title
    }

    get fio() {
        return [
            (this.lastName || '').trim(),
            (this.firstName || '').trim(),
            (this.secondName || '').trim(),
        ].filter(item => !!item).join(' ')
    }

    get passportReal() {
        if ((this.passport_num || '').match('000000')) {
            return ''
        } else {
            return this.passport.toUpperCase()
        }
    }

    get snilsReal() {
        if (this.snils.match('000000')) {
            return ''
        } else {
            return this.snils
        }
    }

    get passportSer() {
        const ser = (this.passport_ser || '').trim()
        if (ser.match(/([бБ]\/[cС]|[бБ]\\[cС]|[бБ][cС]|без|б\.)/i) ) {
            return ''
        } else {
            return ser
        }
    }

    get passportNum() {
        const num = (this.passport_num || '').trim()
        return num
    }

    get passport() {
        return [this.passportSer, this.passportNum].filter(item => !!item).join('_')
    }

    getNid() {
        return this.id
    }

    getEpguTitle() {
        return this.fio
    }

    get eduEpguLevel() {
        return this.getEpguEduDocLevel()
    }

    async getEduType() {


    }

    getEpguEduDocLevel() {

        const edu: any = this.data['edu'] || {}

        let $eduDocType

        if (this.clevel == 5) {
            $eduDocType = 4 // 'HighEduDiplomaDocument';
        } else if (this.clevel == 3) {
            $eduDocType = 6 // 'HighEduDiplomaDocument';
        } else {
            const ceducation = parseInt(edu['ceducation'])
            switch (ceducation) {
                case 1:
                    $eduDocType = 2 //'SchoolCertificateDocument'; 11class
                    break;
                case 2:
                    $eduDocType = 1 //'BasicDiplomaDocument'; 9class
                    break;
                case 3:
                    $eduDocType = 3 //'MiddleEduDiplomaDocument'; spo
                    break;
                case 4:
                    $eduDocType = 4 // 'HighEduDiplomaDocument'; bak
                    break;
                case 500466:
                    $eduDocType = 4 // 'HighEduDiplomaDocument'; vis
                    break;
                case 500467:
                    $eduDocType = 2 //'SchoolCertificateDocument';
                    break;
            }
        }

        return $eduDocType
    }

    getNestedDoc(data, path = []) {
        const docs = this.getNestedDocs(data, path)
        return docs && docs.length ? docs[0] : null
    }

    getNestedDocs(data, path = []) {

        if (!data)
            return null;

        let child = data

        for (const pathItem of path) {
            child = child[pathItem]
            if (child) {
                if (Array.isArray(child)) {
                    return child
                }
            } else {
                return []
            }
        }

        return child ? (!Array.isArray(child) ? [child] : child) : []
    }


    public get personCode() {
        if (this.getSnils()) {
            return this.getSnils()
        } else {
            return [this.data['passport_ser'], this.data['passport_num']].filter(item => !!item).map(item => item.trim()).join('.')
        }
    }

    public get abitUniqName() {
        return this.fio + ' ' + this.personCode
    }

    getApp(id): AisCompetitionGroup {
        return this.apps['id'](id)
    }

    getAppByUid(uid) {
        return this.apps.find(app => app.epgu.uid === uid)
    }

    reindexApps() {
        let index = 1;
        this.apps = this.apps.sort((a, b) => ((a.ord > b.ord) ? 1 : -1)).map((item) => {
            item.ord = index++;
            return item
        })
    }

    getSnils() {

        if (!this.snils || this.snils.match(/^0+$/))
            return null

        return this.snils && this.snils.replace(/[^\d]/g, '')
    }

    getSnilsOrId() {
        return this.getSnils() || this.id
    }

    getAppsSorted() {
        return [...this.apps].sort((a, b) => ((a.priority > b.priority) ? 1 : -1))
    }
}
