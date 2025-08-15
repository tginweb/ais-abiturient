import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order";
import {aisCitizenTypeByCode, cisCitizenTypeEnum} from "~modules/edu-org/enum/ais-student-status";
import {AbitAppModel} from "~modules/edu-org/modules/abit/core/app";

const moment = require('moment')

export default async function aisGenerate(ctx: any) {

    const self: AbitOrderModel = this

    const fields: any = {};
    const statusInfo = self.getStateStatusInfo()

    fields.result = 'success'
    fields.id = this.nid
    fields.date_generation = moment().format('YYYY-MM-DD')

    fields.studentAisId = self.ais.aisId

    if (self.prezachCompetition) {
        fields.cadmission = self.prezachCompetition.cadmission
        fields.competitionName = self.prezachCompetition.name
        fields.statusAisId = 1
        fields.statusName = 'студент'
    } else if (self.firstApp) {
        if (self.firstApp.competition) {
            fields.cadmission = self.firstApp.cadmission
            fields.competitionName = self.firstApp.competition.name
        }
    }

    let citizenshipCode

    if (aisCitizenTypeByCode[self.anket.personal.citizenship]) {
        citizenshipCode = self.anket.personal.citizenship
    } else {
        citizenshipCode = 'russia'
    }

    const citizen = aisCitizenTypeByCode[citizenshipCode]

    fields.citizenshipAisId = citizen.id
    fields.citizenshipName = citizen.name

    if (citizenshipCode !== cisCitizenTypeEnum.RUSSIA) {
        if (this.anket.personal.citizenshipCountry) {
            const country = await self.getService().eduCountryService.model.findOne({nid: this.anket.personal.citizenshipCountry})
            if (country) {
                fields.citizenshipCountryAisId = country.aisId
                fields.citizenshipCountryName = country.title
            }
        }
    }

    if (!fields.citizenshipCountryAisId) {
        fields.citizenshipCountryAisId = 14
        fields.citizenshipCountryName = 'РФ'
    }

    switch (this.eduTypeSlug) {
        case 'spo':
            fields.application_type_name = 'СПО';
            break;
        case 'bak':
            fields.application_type_name = 'Бакалавриат и специалитет';
            break;
        case 'mag':
            fields.application_type_name = 'Магистратура';
            break;
        case 'asp':
            fields.application_type_name = 'Аспирантура';
            break;
    }

    const identDoc = await self.getEpguIdentDoc()

    fields.application_status_name = this.getStateStatusInfo().titleClient
    fields.application_status = this.state.status

    fields.inn = this.anket.personal.inn
    fields.medins = self.snilsReal

    fields.lname = this.anket.personal.lastName.trim()
    fields.fname = this.anket.personal.firstName.trim()
    fields.mname = this.anket.personal.secondName.trim()

    fields.csex = this.anket.personal.gender == 'male' ? 1 : 2
    fields.birthday = this.anket.personal.birthday
    fields.birthplace = this.anket.personal.birthplace

    fields.doctype_name = identDoc.docTypeName
    fields.passport_ser = identDoc.docSeries
    fields.passport_num = identDoc.docNumber
    fields.passport_date = identDoc.issueDate
    fields.passport_place = identDoc.docOrg
    fields.passport_podr = identDoc.subdivisionCodeFormatted

    fields.address = this.anket.personal.addressReg['name']
    fields.email = this.anket.personal.email
    fields.phone = this.anket.personal.phone

    if (this.anket.personal.addressEqual) {
        fields.address_live = this.anket.personal.addressReg['name']
    } else {
        fields.address_live = this.anket.personal.addressLive['name']
    }

    switch (self.anket.education.prevEduLevel) {
        case 1: // spec
            fields.ceducation = 500469
            break;
        case 2: // bak
            fields.ceducation = 500471
            break;
        case 3: // mag
            fields.ceducation = 500468
            break;
        case 4: // spo
            fields.ceducation = 3
            break;
        case 7: // 11
            fields.ceducation = 1
            break;
        case 8: // 9
            fields.ceducation = 2
            break;
    }


    fields.irnituEduThisYear = !!this.anket.education.irnituEdu2020

    const eduDoc = await self.getEpguEduDoc()

    if (eduDoc) {
        fields.education_doc_seria = eduDoc.docSeries
        fields.education_doc_number = eduDoc.docNumber
        fields.education_doc_date = eduDoc.issueDate
        fields.education_doc_organ = eduDoc.docOrg

        if (eduDoc.issueDate) {
            let eduDate = eduDoc.issueDate.split('.')
            fields.education_year = eduDate[2]
        }
    } else {
        fields.education_doc_seria = ''
        fields.education_doc_number = ''
        fields.education_doc_date = ''
        fields.education_doc_organ = ''
    }

    fields.exam_specials = this.anket.entrance.specialNeeds || ''
    fields.target_org = this.anket.entrance.targetOrganization || ''
    fields.obsh = this.anket.personal.needFlat ? 1 : 0


    const appGroups = await self.getAppGroups()
    const apps: AbitAppModel[] = []

    for (const appGroup of appGroups) {
        const appGroupApps = await appGroup.getActiveAppsCollection()
        for (const app of appGroupApps.sortByPriority().all()) {
            apps.push(app)
        }
    }

    let studentCset

    for (let index = 0; index < apps.length; index++) {

        const item = apps[index]

        fields['cadmission_' + index + '_id'] = item.cadmission
        fields['cadmission_' + index + '_name'] = item.competition.name

        let cset, cset_name, cpriemcat, cpriemcat_name

        switch (item.csource) {
            case 1:
                cset = 1 // бюджет
                cset_name = 'бюджет'
                cpriemcat = 1
                cpriemcat_name = 'На общих основаниях'
                break;
            case 2:
                cset = 1 // квота
                cset_name = 'бюджет'
                cpriemcat = 2
                cpriemcat_name = 'Имеющие особое право'
                break;
            case 3:
                cset = 3 // коммерческий
                cset_name = 'коммерческий'
                cpriemcat = 1
                cpriemcat_name = 'На общих основаниях'
                break;
            case 4:
                cset = 2 // целевой
                cset_name = 'целевой'
                cpriemcat = 1
                cpriemcat_name = 'На общих основаниях'
                break;
            case 5:
                cset = 1 // Отдельная квота
                cset_name = 'бюджет'
                cpriemcat = 4
                cpriemcat_name = 'Отдельная квота'
                break;
        }

        fields['cadmission_' + index + '_cset_id'] = cset
        fields['cadmission_' + index + '_cset_name'] = cset_name

        fields['cadmission_' + index + '_cabitpriemcat_id'] = cpriemcat
        fields['cadmission_' + index + '_cabitpriemcat_name'] = cpriemcat_name

        if (item.isZach || index === 0) {
            studentCset = cset
        }
    }

    if (studentCset) {
        fields['cset'] = studentCset
    }



    const tests = await self.getTests()

    let testIndex = 0

    for (const test of tests) {
        if (test.ball && test.ball > 0) {
            fields['csubject_' + testIndex + '_csubject'] = test.csubject
            fields['csubject_' + testIndex + '_mark'] = test.ball
            fields['csubject_' + testIndex + '_cresultSourceType'] = test.passingTypeAisId
            testIndex++
        }
    }



    /*
target=0
target_org=
lgot_type_name=Нет
lgot_type_value=none
lgot_doc=
achievement=
  */

    if (self.decree) {
        fields.orderId = self.decree.nid
        fields.orderAisId = self.decree.aisId
        fields.orderName = self.decree.name
    } else{
        fields.orderId = ''
        fields.orderAisId = ''
        fields.orderName = ''
    }

    return `[General]\n` + Object.keys(fields).filter(key => {
        return true
    }).map((key) => {
        let val = fields[key]
        if (val === null || typeof val === 'undefined') {
            val = ''
        }
        return key + '=' + val
    }).join(`\n`)
}
