import {modelOptions, plugin, prop, Ref} from "@typegoose/typegoose";
import paginationPlugin from '~lib/db/mongoose/plugins/graphql'
import {EduSubjectModel} from '../../subject/core/model'
import {EduDirectionModel} from '../../direction/core/model'
import {EduLevelModel} from '../../level/core/model'
import {EduFobModel} from '../../fob/core/model'
import {EduCampaignModel} from '../../campaign/core/model'
import {EduAdmissionCompetitionModel} from "./model/competion";
import {EduCompetitionTestModel} from "./model/competion-test";
import {EduCompetitionTestLocationModel} from "./model/competion-test-location";

import {EduEntityModel} from "../../../model/edu-entity-model";
import {ObjectID} from "mongodb";
import {EduInstituteModel} from "~modules/edu-org/modules/institute/core/model";
import {EduCompetitionModel} from "~modules/edu-org/modules/competition/core/model";
import {EduAdmissionModelContext} from "~modules/edu-org/modules/admission/core/model-context";
import parseCsvFile from "~lib/util/data/parseCsvFile";
import * as path from "path";

const dayjs = require('dayjs')

export class EduProgramSubjectInfo {
    @prop()
    public tnum: number

    @prop()
    public tstring: string
}

export class EduAdmissionSubject {

    @prop({cfilter: true})
    public csubject: number

    @prop()
    public minimal: number

    @prop()
    public cexampasstype: number

    @prop()
    public centertestType: number

    @prop()
    public number: number

    @prop({_id: false, default: {}})
    public info: EduProgramSubjectInfo

    @prop({ref: EduSubjectModel, localField: "csubject", foreignField: "id", justOne: true})
    public subject?: EduSubjectModel


}

@plugin(paginationPlugin, {
    defaultSortField: 'id',
    defaultSortAscending: false,
    views: {
        default: ['_id', 'id', 'direct_name'],
        public: [
            '_id',
            'id',
            'direct_name',
            'name',
            'abbr',
            'subjectsHaveOptional',
            'subjects',
            'yr',
            'cfob',
            'cadmkind',
            'cdirection',

            'campaign',
            'direction',
            'level',
            'fob',

            'competitions'
        ],
    }
})
@plugin(require('mongoose-named-scopes'))
@modelOptions({
    schemaOptions: {
        collection: "edu_admission",
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    }
})
export class EduAdmissionModel extends EduEntityModel {

    _id: ObjectID

    @prop({cfilter: true})
    id: number;

    @prop({cfilter: true})
    ccampaign: number;

    @prop({
        cfilter: true
    })
    clevel: number;


    @prop({cfilter: true})
    cfac: number;

    @prop({})
    ckaf: number;

    @prop({})
    cspec: number;

    @prop({cfilter: true})
    cfob: number;

    @prop({})
    cpodkind: number;

    @prop({})
    accelerated: string;

    @prop({cfilter: true})
    yr: number;

    @prop({})
    abbr: string;

    @prop({})
    spec_name: string;

    @prop({})
    kvalif_name: string;

    @prop({cfilter: true})
    direct_name: string;

    @prop({cfilter: true})
    name: string;

    @prop({})
    celsum: number;

    @prop({})
    comsumf: number;

    @prop({})
    comsumu: number;

    @prop({cfilter: true})
    haveDetailTarget: boolean

    @prop({})
    isegeadmis: string;

    @prop({})
    cabitspecgroup: number;

    @prop({})
    cmagdirect: number;

    @prop({})
    mag: string;


    @prop({})
    inostr: string;

    @prop({})
    active: string;


    @prop({})
    cpnr: number;

    @prop({})
    cdirection2years: number;

    @prop({})
    cprofili: number;

    @prop({})
    cendkaf: number;

    @prop({})
    index_adm: number;

    @prop({})
    dateend: Date;

    @prop({})
    coldfac: number;

    @prop({})
    prbak: string;

    @prop({})
    group_osn: number;

    @prop({})
    group_lgot: number;

    @prop({})
    ccatspo: number;

    @prop({})
    cdekanat: number;


    @prop({})
    budgCount: number;


    @prop({})
    budgPlaces: number;

    @prop({})
    lgotQuota: number;

    @prop({})
    celevQuota: number;

    @prop({})
    celevQuotaComp: number;


    @prop({})
    celevQuota_gazprom: number;

    @prop({})
    celevQuota_ulanavia: number;

    @prop({})
    celevQuota_magadanenergo: number;

    @prop({})
    celevQuota_magadanenrem: number;

    @prop({})
    celevQuota_kolymaenergo: number;

    @prop({})
    celevQuota_irkrelay: number;

    @prop({})
    celevQuota_minpromtorg: number;


    @prop({})
    celevQuota_dalgen: number;

    @prop({})
    celevQuota_burenie: number;

    @prop({})
    celevQuota_rusaltaishet: number;

    @prop({})
    celevQuota_obaviastroy: number;

    @prop({})
    celevQuota_chaplygin: number;

    @prop({})
    celevQuota_rosseti: number;

    @prop({})
    celevQuota_irkut: number;


    @prop({})
    comercCount: number;

    @prop({})
    oboronQuota: number;

    @prop({})
    specQuota: number;

    @prop({cfilter: true})
    cdirection: number;

    @prop({cfilter: true})
    cdirectionOriginal: number;

    @prop({})
    abitpref: number;

    @prop({cfilter: true})
    subjectsHaveOptional: boolean;


    @prop({type: EduAdmissionSubject})
    public subjects?: EduAdmissionSubject[]

    @prop({ref: EduCampaignModel, localField: "ccampaign", foreignField: "id", justOne: true})
    public campaign?: Ref<EduCampaignModel>;

    @prop({ref: EduLevelModel, localField: "clevel", foreignField: "id", justOne: true})
    public level?: Ref<EduLevelModel>;

    @prop({ref: EduDirectionModel, localField: "cdirection", foreignField: "id", justOne: true})
    public direction?: EduDirectionModel;

    @prop({ref: EduFobModel, localField: "cfob", foreignField: "id", justOne: true})
    public fob?: EduFobModel;

    @prop({ref: EduInstituteModel, localField: "cfac", foreignField: "id", justOne: true})
    public fac?: EduInstituteModel;

    @prop({type: EduAdmissionCompetitionModel})
    public competitions?: EduAdmissionCompetitionModel[]

    @prop({ref: () => EduCompetitionModel, localField: "id", foreignField: "cadmission", justOne: false})
    public competitionsList?: EduCompetitionModel[]

    @prop({cfilter: true})
    epguExport: boolean


    fobFetched: boolean

    public get entityType() {
        return 'edu_admission'
    }

    public get adminUrl() {
        return '/admin/edu/admission/' + this.id + '/view'
    }

    public context: EduAdmissionModelContext = {}

    getService() {
        return this.context && this.context.service
    }

    getSubjectsByPriority(): Record<string, EduAdmissionSubject[]> {
        return this.subjects.reduce((map, item) => {
            if (!map[item.number]) {
                map[item.number] = []
            }
            map[item.number].push(item)
            return map
        }, {})
    }

    async getFob(): Promise<EduFobModel> {
        if (!this.fob && !this.fobFetched) {
            this.fob = await this.getService().eduFobService.query().getByNid(this.cfob)
            this.fobFetched = true
        }
        return this.fob
    }

    async getActions() {

        const result = []

        result.push({
            label: 'Просмотр',
            listEvent: 'open',
            icon: 'view',
            rowRoot: true,
            type: 'vrouter',
            path: this.adminUrl
        })

        result.push({
            id: 'fill',
            label: 'Заполнить',
            icon: 'view',
            type: 'dispatch',
            path: 'edu_admission/entityFill',
            confirm: true,
            group: true,
        })

        result.push({
            id: 'fillGosline',
            label: 'Заполнить гослинию',
            icon: 'view',
            type: 'dispatch',
            path: 'edu_admission/entityFillGosline',
            confirm: true,
            group: true,
        })

        result.push({
            id: 'epgu_enable',
            label: 'Toggle в ЕПГУ',
            icon: 'view',
            type: 'dispatch',
            path: 'edu_admission/epguExport',
            confirm: true,
            group: true,
        })

        result.push(({
            id: 'epgu',
            label: 'ЕПГУ',
            icon: 'view',
            group: true,
            children: [
                {
                    group: true,
                    label: 'Competition',
                    children: [
                        {
                            label: 'Add',
                            confirm: true,
                            group: true,
                            type: 'dispatch',
                            path: 'edu_epgu_message/apiMutate',
                            argsIdMultiple: true,
                            args: {
                                mutation: 'createFromEntity',
                                messageType: 'CompetitionAdd',
                                entityType: 'edu_admission',
                            },
                        },
                        {
                            label: 'Edit',
                            confirm: true,
                            group: true,
                            type: 'dispatch',
                            path: 'edu_epgu_message/apiMutate',
                            argsIdMultiple: true,
                            args: {
                                mutation: 'createFromEntity',
                                messageType: 'CompetitionEdit',
                                entityType: 'edu_admission',
                            },
                        },
                        {
                            label: 'Remove',
                            confirm: true,
                            group: true,
                            type: 'dispatch',
                            path: 'edu_epgu_message/apiMutate',
                            argsIdMultiple: true,
                            args: {
                                mutation: 'createFromEntity',
                                messageType: 'CompetitionRemove',
                                entityType: 'edu_admission',
                            },
                        }
                    ],
                },
                {
                    group: true,
                    label: 'Tests',
                    children: [
                        {
                            label: 'Add',
                            confirm: true,
                            type: 'dispatch',
                            path: 'edu_epgu_message/apiMutate',
                            argsIdMultiple: true,
                            args: {
                                mutation: 'createFromEntity',
                                messageType: 'EntranceTestListAdd',
                                entityType: 'edu_admission',
                            },
                        },
                        {
                            label: 'Edit',
                            confirm: true,
                            type: 'dispatch',
                            path: 'edu_epgu_message/apiMutate',
                            argsIdMultiple: true,
                            args: {
                                mutation: 'createFromEntity',
                                messageType: 'EntranceTestListEdit',
                                entityType: 'edu_admission',
                            },
                        },
                        {
                            label: 'Remove',
                            confirm: true,
                            type: 'dispatch',
                            path: 'edu_epgu_message/apiMutate',
                            argsIdMultiple: true,
                            args: {
                                mutation: 'createFromEntity',
                                messageType: 'EntranceTestListRemove',
                                entityType: 'edu_admission',
                            },
                        }
                    ]
                },
            ],
        }))

        return result
    }

    async fillGosline() {

        const competitionService = await this.context.service.entityService.service('edu_competition')

        if ([1, 2, 3, 5].indexOf(this.clevel)) {

            if (this.budgPlaces || this.comercCount) {

                let competitionDoc = await competitionService.query().where({
                    cadmission: this.id,
                    csource: 6
                }).execOne()

                if (!competitionDoc) {
                    competitionDoc = competitionService.createModel({})
                    competitionDoc.cadmission = this.id
                    competitionDoc.name = this.abbr + '-23, иностранцы по гос. линии'
                    competitionDoc.csource = 6
                    competitionDoc.cdirection = this.cdirection
                    competitionDoc.admissionNumber = 0
                    competitionDoc.celevOrg = null

                    const uid = 'adm:' + this.id + '.' + 6

                    competitionDoc.uid = uid
                    competitionDoc.clevel = this.clevel
                    competitionDoc.ccampaign = this.ccampaign
                    competitionDoc.cfac = this.cfac
                    competitionDoc.cfob = this.cfob
                }

                await competitionDoc.savePromise()
            }
        }

        return true
    }

    async fill() {

        /*
        await this.fillSubjects()

         */

        await this.fillCompetitions()
        await this.fillCompetitionsTests()
        await this.savePromise()

        const competitionService = await this.context.service.entityService.service('edu_competition')

        for (let competition of this.competitions) {

            if (competition.isdop || true) {

                let competitionDoc = await competitionService.query().where({
                    cadmission: this.id,
                    csource: competition.csource,
                    isdop: true
                }).execOne()

                if (!competitionDoc) {
                    competitionDoc = competitionService.createModel({})
                    competitionDoc.isdop = true
                    competitionDoc.cadmission = this.id
                    competitionDoc.csource = competition.csource
                    competitionDoc.cdirection = this.cdirection
                    competitionDoc.name = competition.nameComp
                    const uid = 'dopadm:' + this.id + '.' + competition.csource
                    competitionDoc.uid = uid
                    competitionDoc.celevOrg = competition.celevOrg
                    competitionDoc.clevel = this.clevel
                    competitionDoc.ccampaign = this.ccampaign
                    competitionDoc.cfac = this.cfac
                    competitionDoc.cfob = this.cfob
                }

                competitionDoc.admissionNumber = competition.admissionNumber

                await competitionDoc.savePromise()
            }
        }

        return true
    }

    async fillCompetitionsTestsLocations() {

        for (let competition of this.competitions) {

            for (let test of competition.tests) {

                const subjectDoc = await this.context.service.entityService.findOne('edu_subject', {id: test.csubject})

                test.locations = []

                if (subjectDoc.isege === 'f' && subjectDoc.locations) {

                    for (let subjectDocLocation of subjectDoc.locations) {

                        let testLocation = this.findSubdoc<EduCompetitionTestLocationModel>(test.locations, {
                            id: subjectDocLocation.id
                        })

                        if (!testLocation) {
                            testLocation = <EduCompetitionTestLocationModel>{
                                id: subjectDocLocation.id,
                            }
                        }

                        testLocation.date = subjectDocLocation.date
                        testLocation.place = subjectDocLocation.place
                        testLocation.name = dayjs(subjectDocLocation.date).format('DD.MM.YYYY HH:mm')

                        console.log(testLocation.name)

                        if (!testLocation._id)
                            test.locations.push(testLocation)
                    }
                }
            }
        }
    }

    async fillCompetitionsTests() {

        for (let competition of this.competitions) {

            if (!competition.isdop)
                continue;

            let index = 0

            let haveOptional = false

            for (let subject of this.subjects) {

                index++

                const eduSubjectDoc = await this.context.service.entityService.findOne('edu_subject', {id: subject.csubject})

                let testDoc = this.findSubdoc<EduCompetitionTestModel>(competition.tests, {
                    csubject: subject.csubject
                })

                if (!testDoc) {
                    testDoc = <EduCompetitionTestModel>{
                        id: subject.csubject,
                        csubject: subject.csubject,
                    }
                }

                testDoc.minimal = subject.minimal
                testDoc.cexampasstype = subject.cexampasstype
                testDoc.centertestType = subject.centertestType
                testDoc.number = subject.number
                testDoc.priority = subject.number
                testDoc.name = eduSubjectDoc ? eduSubjectDoc.name : 'Предмет ' + subject.csubject

                if (!haveOptional) {

                    const optionalSubject = this.subjects.find(item => item !== subject && item.number === subject.number)

                    if (optionalSubject) {
                        haveOptional = true
                        testDoc.optionalId = optionalSubject.csubject
                    } else {
                        testDoc.optionalId = null
                    }

                } else {
                    testDoc.optionalId = null
                }

                if (!testDoc._id)
                    competition.tests.push(testDoc)
            }
        }

    }

    async fillSubjects() {

        const byNumbers: any = {}

        for (let subject of this.subjects) {

            if (!byNumbers[subject.number]) byNumbers[subject.number] = []

            byNumbers[subject.number].push(subject)
        }

        const foundSameNumber = Object.values(byNumbers).find((items: any) => items.length > 1)

        this.subjectsHaveOptional = !!foundSameNumber
    }

    async fillCompetitions() {

        const types = [
            {field: 'budgPlaces', source: 1, name: 'бюджет'},
            {field: 'lgotQuota', source: 2, name: 'особая квота'},
            {field: 'celevQuota', source: 4, name: 'целевой'},
            {field: 'comercCount', source: 3, name: 'коммерческий'},
            {field: 'specQuota', source: 5, name: 'отдельная квота'},

            {field: 'budgPlaces', source: 1, name: 'бюджет', isdop: true},
            {field: 'lgotQuota', source: 2, name: 'особая квота', isdop: true},
            {field: 'celevQuota', source: 4, name: 'целевой', isdop: true},
            {field: 'specQuota', source: 5, name: 'отдельная квота', isdop: true},

            {
                field: 'sovmestCelevLgotCount',
                source: 7,
                name: 'совмещенная квота (целевой + особое право)',
                isdop: true
            },
            {
                field: 'sovmestAllCount',
                source: 8,
                name: 'совмещенная квота (целевой + особое право + отдельная)',
                isdop: true
            },
        ]

        let dopnabRows: any = await parseCsvFile(path.join(process.cwd(), 'import/dopnab.csv'), null, ';')

        const dopnabByAbbr = dopnabRows.reduce((map, item) => {
            map[item.abbr] = item
            return map
        }, {})


        const admission = this

        //this.competitions = []

        for (let t = 0; t < types.length; t++) {

            const type = types[t]

            if (type.isdop) {

                const dopnab = dopnabByAbbr[this.abbr]

                if (dopnab) {

                    const nabor = dopnab[type.field] || 0

                    let competitionDoc

                    competitionDoc = this.competitions.find(item => {
                        return item.isdop && (item.csource === type.source)
                    })

                    if (type.field === 'budgPlaces') {

                    } else {
                        if (!competitionDoc && !nabor) continue;
                    }


                    if (!competitionDoc) {
                        competitionDoc = <EduAdmissionCompetitionModel>{
                            id: type.source,
                            csource: type.source,
                            isdop: true
                        }
                    }

                    const name = [
                        admission.name,
                        type.name,
                        'допнабор'
                    ]

                    Object.assign(competitionDoc, {
                        name: name.join(', '),
                        cfob: admission.cfob,
                        admissionNumber: nabor,
                    })

                    if (!competitionDoc._id)
                        this.competitions.push(competitionDoc)
                }

            } else {

                // continue;

                const nabor = this[type.field] || 0

                if (type.field === 'budgPlaces') {

                    if (!nabor) {
                        if (!this.celevQuota && !this.specQuota && !this.lgotQuota) {
                            continue;
                        }
                    }

                } else {
                    if (!nabor) continue;
                }

                let competitionDoc

                competitionDoc = <EduAdmissionCompetitionModel>{
                    id: type.source,
                    csource: type.source,
                }

                const name = [
                    admission.name,
                    type.name,
                ]

                Object.assign(competitionDoc, {
                    name: name.join(', '),
                    cfob: admission.cfob,
                    admissionNumber: nabor,
                })

                this.competitions.push(competitionDoc)
            }

        }

    }

    get orderTypeId() {
        switch (this.clevel) {
            case 1:
            case 2:
                return 2;
            case 3:
                return 3;
            case 4:
                return 1;
            case 5:
                return 4;
        }
    }

    get levelFisId() {
        switch (this.clevel) {
            case 1:
                return 5;
            case 2:
                return 2;
            case 3:
                return 4;
            case 4:
                return 17;
            case 5:
                return 21;
        }
    }

    get fobFisId() {
        switch (this.cfob) {
            case 1:
                return 11;
            case 2:
                return 10;
            case 3:
                return 12;
        }
    }

    getDebugData() {
        return {
            _id: this._id,
            id: this.id,
            name: this.name,
            direct_name: this.direct_name,
        }
    }
}
