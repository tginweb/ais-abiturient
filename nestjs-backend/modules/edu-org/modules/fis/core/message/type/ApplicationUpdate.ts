import {modelOptions} from "@typegoose/typegoose";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";
import {AbitWorkplaceEnum} from "~modules/edu-org/enum/source-workplace";
import {formatToEpguDate} from "~modules/edu-org/modules/epgu/core/util";
import {EduDocModel} from "~modules/edu-org/modules/doc/core";
import {EduDocRoleEnum} from "~modules/edu-org/modules/doc/core/enum";
import {AppStatusEnum} from "~modules/edu-org/modules/abit/core/app/enum";
import {EduFisMessageModel} from "~modules/edu-org/modules/fis/core/message";
import {AbitTestPassingTypeEnum} from "~modules/edu-org/modules/abit/core/test/enum";

const dayjs = require('dayjs')
const trim = require('locutus/php/strings/trim')

interface DocArgs {
    snils: string
    guid: string
}

@modelOptions({
    schemaOptions: {
        collection: "fis_message",
        discriminatorKey: "type",
    }
})
export class ApplicationUpdate extends EduFisMessageModel {

    get fisEntityType() {
        return 'ApplicationUpdate'
    }

    get fisAction() {
        return 'Add'
    }

    getArgs(): DocArgs {
        return this.args
    }


    async generatePayload() {

        const entrants: AbitOrderModel[] = await this.getArgEntities()

        let packets = []

        let IdObjects = []

        for (const entrant of entrants) {

            const aid = '2023_' + entrant.nid

            const entrantTests = await entrant.getTests()
            const docs = await entrant.getDocs()

            const identDoc = await entrant.getEpguIdentDoc()

            if (!identDoc) {
                console.log(entrant.nid)
                continue;
            }

            if (formatToEpguDate(identDoc.issueDate) === 'Invalid Date') {
                identDoc.issueDate = '20.02.2000'
            }

            const compLastName = (identDoc.fields['Surname'] || entrant.anket.personal.lastName).trim()
            const compFirstName = (identDoc.fields['Name'] || entrant.anket.personal.firstName).trim()
            const compSecondName = (identDoc.fields['Patronymic'] || entrant.anket.personal.secondName).trim()

            const fisEntrant: any = {
                UID: aid,
                LastName: compLastName,
                FirstName: compFirstName,
                GenderID: entrant.anket.personal.gender === 'male' ? 1 : 2,
                EmailOrMailAddress: {
                    Email: 'abit.site@cis.istu.edu'
                }
            }

            if (compSecondName) {
                fisEntrant.MiddleName = compSecondName
            }

            if (entrant.snilsReal) {
                fisEntrant.SNILS = entrant.snilsReal
            }

            const fisIdentDoc: any = {
                UID: 'DOC_IDENT_' + aid,
                LastName: compLastName,
                FirstName: compFirstName,
                GenderID: entrant.anket.personal.gender === 'male' ? 1 : 2,
                DocumentOrganization: identDoc.docOrg,
                DocumentDate: formatToEpguDate(identDoc.issueDate),
                BirthDate: formatToEpguDate(entrant.anket.personal.birthday),
            }

            if (compSecondName) {
                fisIdentDoc.MiddleName = compSecondName
            }

            let identityDocumentTypeID, nationalityTypeID, releasePlace

            if (entrant.anket.personal.citizenship !== 'russia') {
                identityDocumentTypeID = 3;
                nationalityTypeID = 108
                releasePlace = 'Киргизия'
            } else {
                identityDocumentTypeID = 1
                nationalityTypeID = 1
                releasePlace = 'РФ'
            }

            fisIdentDoc.IdentityDocumentTypeID = identityDocumentTypeID
            fisIdentDoc.NationalityTypeID = nationalityTypeID
            fisIdentDoc.ReleaseCountryID = nationalityTypeID
            fisIdentDoc.ReleasePlace = releasePlace

            const docSeries = (identDoc.docSeries || '').trim().replace(/\s/gi, '')
            const docNumber = (identDoc.docNumber || '').trim().replace(/[^\d]/gi, '')

            if (docSeries)
                fisIdentDoc.DocumentSeries = docSeries

            fisIdentDoc.DocumentNumber = docNumber

            //fisIdentDoc.OriginalReceivedDate

            let usedDocNumbers = {}

            usedDocNumbers[docNumber] = docNumber

            const otherIdentityDocuments = []
            const fisCompetitions = []
            const fisTests = []

            const anketDocNumber = (entrant.anket.personal.doc.number || '').trim()
            const anketDocSeries = (entrant.anket.personal.doc.serial || '').trim()

            if (anketDocNumber && (docNumber !== anketDocNumber)) {

                const doc: any = {
                    UID: 'DOC_IDENT_' + aid + '_anket',
                    IdentityDocumentTypeID: identityDocumentTypeID,
                    NationalityTypeID: nationalityTypeID,
                    LastName: compLastName,
                    FirstName: compFirstName,
                    GenderID: entrant.anket.personal.gender === 'male' ? 1 : 2,
                    DocumentNumber: anketDocNumber,
                    DocumentOrganization: identDoc.docOrg,
                    DocumentDate: formatToEpguDate(identDoc.issueDate),
                    BirthDate: formatToEpguDate(entrant.anket.personal.birthday),
                }

                if (compSecondName) {
                    doc.MiddleName = compSecondName
                }

                if (anketDocSeries) {
                    doc.DocumentSeries = anketDocSeries
                }

                otherIdentityDocuments.push(doc)
                usedDocNumbers[anketDocNumber] = anketDocNumber
            }

            const anketEgeDocNumber = (entrant.anket.personal.docEge.number || '').trim()
            const anketEgeDocSeries = (entrant.anket.personal.docEge.serial || '').trim()

            if (anketEgeDocNumber && !usedDocNumbers[anketEgeDocNumber]) {

                const doc: any = {
                    UID: 'DOC_IDENT_' + aid + '_ege_anket',
                    IdentityDocumentTypeID: identityDocumentTypeID,
                    NationalityTypeID: nationalityTypeID,
                    LastName: compLastName,
                    FirstName: compFirstName,
                    GenderID: entrant.anket.personal.gender === 'male' ? 1 : 2,
                    DocumentNumber: anketEgeDocNumber,
                    DocumentOrganization: identDoc.docOrg,
                    DocumentDate: formatToEpguDate(identDoc.issueDate),
                    BirthDate: formatToEpguDate(entrant.anket.personal.birthday),
                }

                if (compSecondName) {
                    doc.MiddleName = compSecondName
                }

                if (anketEgeDocSeries) {
                    doc.DocumentSeries = anketEgeDocSeries
                }

                otherIdentityDocuments.push(doc)
                usedDocNumbers[anketEgeDocNumber] = anketEgeDocNumber
            }

            for (const doc of docs) {

                if (doc.type === EduDocRoleEnum.PASSPORT) {

                    if ((doc.nid !== identDoc.nid) && doc.docNumber && !usedDocNumbers[doc.docNumber]) {

                        const docNumber = doc.docNumber.trim()
                        const docSeries = doc.docSeries.trim()
                        const docSecondName = (doc.fields['Patronymic'] || compSecondName).trim()

                        const fisDoc: any = {
                            UID: 'DOC_IDENT_' + aid + '_' + doc.nid,
                            LastName: (doc.fields['Surname'] || compLastName).trim(),
                            FirstName: (doc.fields['Name'] || compFirstName).trim(),
                            DocumentNumber: docNumber,
                            DocumentOrganization: identDoc.docOrg,
                            DocumentDate: formatToEpguDate(doc.issueDate),
                            IdentityDocumentTypeID: identityDocumentTypeID,
                            NationalityTypeID: nationalityTypeID,
                            GenderID: entrant.anket.personal.gender === 'male' ? 1 : 2,
                            BirthDate: formatToEpguDate(entrant.anket.personal.birthday),
                        }

                        if (docSecondName) {
                            fisDoc.MiddleName = docSecondName
                        }

                        if (docSeries) {
                            fisDoc.DocumentSeries = docSeries
                        }

                        otherIdentityDocuments.push(fisDoc)
                        usedDocNumbers[docNumber] = docNumber
                    }
                }
            }


            let eduDocType

            if (entrant.eduTypeSlug == 'asp' || entrant.eduTypeSlug == 'mag') {
                eduDocType = 'HighEduDiplomaDocument'
            } else if (entrant.eduTypeSlug === 'spo') {

                switch (entrant.anket.education.prevEduLevel) {
                    case 7: // 11 class
                        eduDocType = 'HighEduDiplomaDocument'
                        break;
                    case 8: // 9 class
                        eduDocType = 'SchoolCertificateBasicDocument'
                        break;
                    default:
                        eduDocType = 'SchoolCertificateBasicDocument'
                        break;
                }

            } else {
                switch (entrant.anket.education.prevEduLevel) {
                    case 1: // spec
                        eduDocType = 'HighEduDiplomaDocument'
                        break;
                    case 2: // bak
                        eduDocType = 'HighEduDiplomaDocument'
                        break;
                    case 3: // mag
                        eduDocType = 'HighEduDiplomaDocument'
                        break;
                    case 4: // spo
                        eduDocType = 'MiddleEduDiplomaDocument'
                        break;
                    case 7: // 11
                        eduDocType = 'SchoolCertificateDocument'
                        break;
                    case 8: // 9
                        eduDocType = 'SchoolCertificateDocument'
                        break;
                    default:
                        eduDocType = 'SchoolCertificateDocument'
                        break;
                }
            }


            let eduDoc: EduDocModel
            let fisEduDoc: any

            for (const doc of docs) {
                if ((doc.type === EduDocRoleEnum.EDU) && doc.docNumber) {
                    eduDoc = doc
                    break;
                }
            }

            if (eduDoc) {

                let docDate = formatToEpguDate(eduDoc.issueDate)

                if (docDate === 'Invalid Date') {
                    docDate = '2023-05-05'
                }

                let [docDateYear] = docDate.split('-')

                docDateYear = docDateYear || 2023

                fisEduDoc = {
                    UID: 'DOC_EDU_' + aid,
                    DocumentDate: docDate,
                    DocumentOrganization: eduDoc.docOrg,
                    EndYear: docDateYear,
                    RegionId: 1,
                    OriginalReceivedDate: '2023-06-22'
                }

                if (eduDoc.docSeries && eduDoc.docSeries.trim()) {
                    fisEduDoc.DocumentSeries = eduDoc.docSeries.trim()
                }

                if (eduDoc.docNumber) {
                    fisEduDoc.DocumentNumber = eduDoc.docNumber.trim()
                }

                for (const entrantTest of entrantTests) {
                    if (entrantTest.csubject === 27) {
                        fisEduDoc.GPA = entrantTest.ball
                    }
                }

            } else {
                console.log(entrant.nid)
                continue;
            }

            for (const appGroup of await entrant.getAppGroups()) {
                const apps = await appGroup.getActiveAppsCollection()
                for (const app of apps.all()) {
                    if (app.statusId === AppStatusEnum.INORDER) {

                        const compet = await app.getCompetition()

                        /*
                        const compet = await this.context.service.competitionService.query().where({
                            cadmission: app.cadmission,
                            csource: 1
                        }).execOne()
                         */

                        const fisCompetition: any = {
                            CompetitiveGroupUID: compet.uid
                        }

                        if (app.csource === 4) {
                            fisCompetition.TargetOrganizationUID = entrant.ais.state['czakaz']
                            fisCompetition.TargetOrganizationContractUID = entrant.ais.state['czakaz']
                            // fisCompetition.TargetOrganizationUID = entrant.ais.state['czakaz']
                        }

                        fisCompetitions.push(fisCompetition)

                        const rating = await this.context.service.competitionService.getInOrderAppRating(compet, entrant, app)

                        for (const test of rating.tests) {

                            if (test.csubject !== 27 && test.csubject !== 37) {

                                let ResultSourceTypeID, EntranceTestTypeID

                                switch (test.passingType) {
                                    case AbitTestPassingTypeEnum.EGE:
                                        ResultSourceTypeID = 1
                                        break;
                                    case AbitTestPassingTypeEnum.INTERNAL:
                                        ResultSourceTypeID = 2
                                        break;
                                    case AbitTestPassingTypeEnum.OLIMP:
                                        ResultSourceTypeID = 3
                                        break;
                                    case AbitTestPassingTypeEnum.GIA:
                                        ResultSourceTypeID = 4
                                        break;
                                }


                                if (test.subject.fisid || (entrant.eduTypeSlug === 'mag' || entrant.eduTypeSlug === 'asp')) {
                                    EntranceTestTypeID = 1;
                                } else {
                                    EntranceTestTypeID = 2;
                                }

                                const fisTest: any = {
                                    UID: aid + '_' + compet.uid + '_' + test.csubject,
                                    ResultValue: test.ball,
                                    ResultSourceTypeID: ResultSourceTypeID,
                                    EntranceTestTypeID: EntranceTestTypeID,
                                    CompetitiveGroupUID: compet.uid,
                                    EntranceTestSubject: {}
                                }

                                if (test.subject.fisid) {
                                    fisTest.EntranceTestSubject.SubjectID = test.subject.fisid
                                } else {
                                    fisTest.EntranceTestSubject.SubjectName = test.subject.name
                                }

                                if (test.passingType === AbitTestPassingTypeEnum.INTERNAL) {
                                    fisTest.ResultDocument = {
                                        InstitutionDocument: {
                                            DocumentNumber: 1000,
                                            DocumentTypeID: 1,
                                        }
                                    }
                                }

                                fisTests.push(fisTest)
                            }
                        }

                        break;
                    }
                }
            }

            const appilcation: any = {
                UID: aid,
                ApplicationNumber: aid,
                After11: false,
                FromEPGU: entrant.cordersource === AbitWorkplaceEnum.EPGU,
                Entrant: fisEntrant,
                RegistrationDate: dayjs(entrant.createAt).format('YYYY-MM-DDT12:00:00'),
                StatusID: 2,
                NeedHostel: !!entrant.anket.personal.needFlat,
                ApplicationDocuments: {
                    IdentityDocument: fisIdentDoc,
                    EduDocuments: {
                        EduDocument: {
                            [eduDocType]: fisEduDoc
                        }
                    }
                },
                FinSourceAndEduForms: {
                    FinSourceEduForm: fisCompetitions
                }
            }


            const customDocs: any = []

            const dateDef = '2023-03-20'

            let achievments: any = entrant.anket.entrance.achievements.reduce((acc, item, index) => {

                if (item.ball) {

                    const customDoc: any = {
                        UID: aid + '_achievement_doc_' + item.achievementType + '_' + index
                    }

                    const achievment = {
                        IAUID: aid + '_achievement_' + item.achievementType + '_' + index,
                        InstitutionAchievementUID: item.achievementFisUid,
                        IAMark: item.ball,
                        IADocumentUID: customDoc.UID
                    }

                    const doc: EduDocModel = docs.find(doc => doc.id === item.docId) || ({} as EduDocModel)

                    customDoc.DocumentDate = doc.issueDate ? formatToEpguDate(doc.issueDate) : dateDef

                    if (item.isDiplom) {

                        /*
                        const achievmentEduDoc = {
                            ...fisEduDoc,
                            UID: customDoc.UID
                        }
                        customDocs.push(achievmentEduDoc)
                         */


                        achievment.IADocumentUID = fisEduDoc.UID
                    } else if (item.isGto) {
                        customDoc.DocumentName = 'Справка ГТО'
                        customDoc.DocumentOrganization = doc.docOrg || 'Всероссийский физкультурно-спортивный комплекс «Готов к труду и обороне»'
                        customDocs.push(customDoc)
                    } else if (item.isOlympic) {
                        customDoc.DocumentName = 'Диплом участника олимпиады'
                        customDoc.DocumentOrganization = doc.docOrg || 'Комитет'
                        customDocs.push(customDoc)
                    } else if (item.isPublications) {
                        customDoc.DocumentName = 'Справка о публикациях'
                        customDoc.DocumentOrganization = doc.docOrg ||  'Справка о публикациях'
                        customDocs.push(customDoc)
                    } else if (item.isSport) {
                        customDoc.DocumentName = 'Документ подтверждающий спортивное достижение'
                        customDoc.DocumentOrganization = doc.docOrg ||  'Комитет'
                        customDocs.push(customDoc)
                    }

                    acc.push(achievment)
                }
                return acc
            }, [])

            if (achievments.length) {
                appilcation.IndividualAchievements = {
                    IndividualAchievement: achievments
                }
            }


            if (!entrant.snilsReal) {
                appilcation.NoSnilsReason = 2
            }

            if (otherIdentityDocuments.length) {
                appilcation.ApplicationDocuments.OtherIdentityDocuments = {
                    IdentityDocument: otherIdentityDocuments
                }
            }

            if (fisTests.length) {
                appilcation.EntranceTestResults = {
                    EntranceTestResult: fisTests
                }
            }

            if (this.getLgots(entrant.ais.aisId)) {
                appilcation.ApplicationCommonBenefits = this.getLgots(entrant.ais.aisId)
            }

            if (customDocs.length) {
                appilcation.CustomDocuments = {
                    CustomDocument: customDocs
                }
            }

            packets.push(appilcation)
        }

        this.args.params = {objects: IdObjects}
        await this.savePromise()

        return {
            'Applications': {
                'Application': packets
            }
        }
    }

    async onProcessResult() {

        /*
        let order: AbitOrderModel = await this.getArgEntity()
        const payload: any = this.response.payload

        const app = payload?.SuccessResultList?.Application

        order.fis.guid = app.GuidEntrant
        await order.savePromise()
         */

        return true
    }

    getLgots(aisId) {
        const map = {
            "2457958": "<ApplicationCommonBenefit>\n<UID>lgot_1278<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24324.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1278<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2016-05-15<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<OriginalReceivedDate>2023-08-19<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2457957": "<ApplicationCommonBenefit>\n<UID>lgot_1249<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24277.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1249<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-07-21<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<DocumentNumber>254<\/DocumentNumber>\n<OriginalReceivedDate>2023-08-19<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2457956": "<ApplicationCommonBenefit>\n<UID>lgot_1253<\/UID>\n<DocumentTypeID>11<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24186.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<MedicalDocuments>\n<BenefitDocument>\n<DisabilityDocument>\n<UID>doc_lgot_1253<\/UID>\n<DocumentSeries>\u041c\u0421\u042d-2021<\/DocumentSeries>\n<DocumentNumber>1549811<\/DocumentNumber>\n<DisabilityTypeID>5<\/DisabilityTypeID>\n<DocumentOrganization>\u041e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0446\u0438\u044f<\/DocumentOrganization>\n<DocumentDate>2023-02-28<\/DocumentDate>\n<OriginalReceivedDate>2023-08-19<\/OriginalReceivedDate>\n<\/DisabilityDocument>\n<\/BenefitDocument>\n<\/MedicalDocuments>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2457952": "<ApplicationCommonBenefit>\n<UID>lgot_1257<\/UID>\n<DocumentTypeID>11<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24307.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<MedicalDocuments>\n<BenefitDocument>\n<DisabilityDocument>\n<UID>doc_lgot_1257<\/UID>\n<DocumentSeries>\u041c\u0421\u042d-2018<\/DocumentSeries>\n<DocumentNumber>1668109<\/DocumentNumber>\n<DisabilityTypeID>5<\/DisabilityTypeID>\n<DocumentOrganization>\u041e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0446\u0438\u044f<\/DocumentOrganization>\n<DocumentDate>2019-11-13<\/DocumentDate>\n<OriginalReceivedDate>2023-08-19<\/OriginalReceivedDate>\n<\/DisabilityDocument>\n<\/BenefitDocument>\n<\/MedicalDocuments>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2457951": "<ApplicationCommonBenefit>\n<UID>lgot_1264<\/UID>\n<DocumentTypeID>11<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24247.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<MedicalDocuments>\n<BenefitDocument>\n<DisabilityDocument>\n<UID>doc_lgot_1264<\/UID>\n<DocumentSeries>\u041c\u0421\u042d-2021<\/DocumentSeries>\n<DocumentNumber>1540701<\/DocumentNumber>\n<DisabilityTypeID>5<\/DisabilityTypeID>\n<DocumentOrganization>\u041e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0446\u0438\u044f<\/DocumentOrganization>\n<DocumentDate>2022-12-01<\/DocumentDate>\n<OriginalReceivedDate>2023-08-19<\/OriginalReceivedDate>\n<\/DisabilityDocument>\n<\/BenefitDocument>\n<\/MedicalDocuments>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2457950": "<ApplicationCommonBenefit>\n<UID>lgot_1250<\/UID>\n<DocumentTypeID>11<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24182.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<MedicalDocuments>\n<BenefitDocument>\n<DisabilityDocument>\n<UID>doc_lgot_1250<\/UID>\n<DocumentSeries>\u041c\u0421\u042d-2021<\/DocumentSeries>\n<DocumentNumber>1510950<\/DocumentNumber>\n<DisabilityTypeID>5<\/DisabilityTypeID>\n<DocumentOrganization>\u041e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0446\u0438\u044f<\/DocumentOrganization>\n<OriginalReceivedDate>2023-08-19<\/OriginalReceivedDate>\n<\/DisabilityDocument>\n<\/BenefitDocument>\n<\/MedicalDocuments>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2457949": "<ApplicationCommonBenefit>\n<UID>lgot_1248<\/UID>\n<DocumentTypeID>11<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24256.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<MedicalDocuments>\n<BenefitDocument>\n<DisabilityDocument>\n<UID>doc_lgot_1248<\/UID>\n<DocumentSeries>\u041c\u0421\u042d-2021<\/DocumentSeries>\n<DocumentNumber>1525684<\/DocumentNumber>\n<DisabilityTypeID>2<\/DisabilityTypeID>\n<DocumentOrganization>\u041e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0446\u0438\u044f<\/DocumentOrganization>\n<OriginalReceivedDate>2023-08-19<\/OriginalReceivedDate>\n<\/DisabilityDocument>\n<\/BenefitDocument>\n<\/MedicalDocuments>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2457945": "<ApplicationCommonBenefit>\n<UID>lgot_1268<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24214.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1268<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-07-26<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<DocumentNumber>426<\/DocumentNumber>\n<DocumentSeries>07-69<\/DocumentSeries>\n<OriginalReceivedDate>2023-08-19<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2457944": "<ApplicationCommonBenefit>\n<UID>lgot_1254<\/UID>\n<DocumentTypeID>11<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24190.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<MedicalDocuments>\n<BenefitDocument>\n<DisabilityDocument>\n<UID>doc_lgot_1254<\/UID>\n<DocumentSeries>\u041c\u0421\u042d-2018<\/DocumentSeries>\n<DocumentNumber>1211009<\/DocumentNumber>\n<DisabilityTypeID>5<\/DisabilityTypeID>\n<DocumentOrganization>\u041e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0446\u0438\u044f<\/DocumentOrganization>\n<DocumentDate>2018-12-17<\/DocumentDate>\n<OriginalReceivedDate>2023-08-19<\/OriginalReceivedDate>\n<\/DisabilityDocument>\n<\/BenefitDocument>\n<\/MedicalDocuments>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2457942": "<ApplicationCommonBenefit>\n<UID>lgot_1266<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24204.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1266<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-07-10<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<DocumentNumber>5061<\/DocumentNumber>\n<OriginalReceivedDate>2023-08-19<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2457938": "<ApplicationCommonBenefit>\n<UID>lgot_1271<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24298.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1271<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-06-29<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<DocumentNumber>007038<\/DocumentNumber>\n<OriginalReceivedDate>2023-08-19<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2457937": "<ApplicationCommonBenefit>\n<UID>lgot_1263<\/UID>\n<DocumentTypeID>11<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24228.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<MedicalDocuments>\n<BenefitDocument>\n<DisabilityDocument>\n<UID>doc_lgot_1263<\/UID>\n<DocumentSeries>\u041c\u0421\u042d-2021<\/DocumentSeries>\n<DocumentNumber>1542173<\/DocumentNumber>\n<DisabilityTypeID>5<\/DisabilityTypeID>\n<DocumentOrganization>\u041e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0446\u0438\u044f<\/DocumentOrganization>\n<DocumentDate>2023-01-01<\/DocumentDate>\n<OriginalReceivedDate>2023-08-19<\/OriginalReceivedDate>\n<\/DisabilityDocument>\n<\/BenefitDocument>\n<\/MedicalDocuments>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2457935": "<ApplicationCommonBenefit>\n<UID>lgot_1265<\/UID>\n<DocumentTypeID>11<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24217.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<MedicalDocuments>\n<BenefitDocument>\n<DisabilityDocument>\n<UID>doc_lgot_1265<\/UID>\n<DocumentSeries>\u041c\u0421\u042d-2021<\/DocumentSeries>\n<DocumentNumber>1563281<\/DocumentNumber>\n<DisabilityTypeID>5<\/DisabilityTypeID>\n<DocumentOrganization>\u041e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0446\u0438\u044f<\/DocumentOrganization>\n<DocumentDate>2023-05-01<\/DocumentDate>\n<OriginalReceivedDate>2023-08-19<\/OriginalReceivedDate>\n<\/DisabilityDocument>\n<\/BenefitDocument>\n<\/MedicalDocuments>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2457932": "<ApplicationCommonBenefit>\n<UID>lgot_1259<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24307.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1259<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2016-05-15<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<OriginalReceivedDate>2023-08-19<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2457931": "<ApplicationCommonBenefit>\n<UID>lgot_1255<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24307.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1255<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2016-05-15<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<OriginalReceivedDate>2023-08-19<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2457301": "<ApplicationCommonBenefit>\n<UID>lgot_1275<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24299.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1275<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2016-05-15<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<OriginalReceivedDate>2023-08-19<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2453860": "<ApplicationCommonBenefit>\n<UID>lgot_1220<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24214.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1220<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-06-16<\/DocumentDate>\n<DocumentName>\u0421\u043f\u0440\u0430\u0432\u043a\u0430<\/DocumentName>\n<DocumentOrganization>\u041c\u0435\u0436\u0440\u0430\u0439\u043e\u043d\u043d\u043e\u0435 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u041c\u0438\u043d\u0438\u0441\u0442\u0435\u0440\u0441\u0442\u0432\u0430 \u0441\u043e\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044f, \u043e\u043f\u0435\u043a\u0438 \u0438 \u043f\u043e\u043f\u0435\u0447\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430 \u0418\u0440\u043a\u0443\u0442\u0441\u043a\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438 \u21161<\/DocumentOrganization>\n<DocumentNumber>2805<\/DocumentNumber>\n<OriginalReceivedDate>2023-07-13<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2453683": "<ApplicationCommonBenefit>\n<UID>lgot_1218<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24299.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1218<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-07-10<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<DocumentNumber>5076<\/DocumentNumber>\n<OriginalReceivedDate>2023-07-11<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2453277": "<ApplicationCommonBenefit>\n<UID>lgot_1207<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24327.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1207<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-07-05<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<DocumentNumber>4972<\/DocumentNumber>\n<OriginalReceivedDate>2023-07-10<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2453271": "<ApplicationCommonBenefit>\n<UID>lgot_1208<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24299.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1208<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2016-05-15<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<OriginalReceivedDate>2023-07-10<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2453097": "<ApplicationCommonBenefit>\n<UID>lgot_1251<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24183.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1251<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2016-05-15<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<DocumentNumber>5062<\/DocumentNumber>\n<OriginalReceivedDate>2023-07-08<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2453062": "<ApplicationCommonBenefit>\n<UID>lgot_1204<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24298.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<MedicalDocuments>\n<BenefitDocument>\n<DisabilityDocument>\n<UID>doc_lgot_1204<\/UID>\n<DocumentSeries>\u041c\u0421\u042d-2021<\/DocumentSeries>\n<DocumentNumber>1535011<\/DocumentNumber>\n<DisabilityTypeID>5<\/DisabilityTypeID>\n<DocumentOrganization>\u041e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0446\u0438\u044f<\/DocumentOrganization>\n<DocumentDate>2023-02-01<\/DocumentDate>\n<OriginalReceivedDate>2023-07-08<\/OriginalReceivedDate>\n<\/DisabilityDocument>\n<\/BenefitDocument>\n<\/MedicalDocuments>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2453028": "<ApplicationCommonBenefit>\n<UID>lgot_1279<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24326.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1279<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-07-24<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<DocumentNumber>(53-3)-3178\/23<\/DocumentNumber>\n<OriginalReceivedDate>2023-07-08<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2452967": "<ApplicationCommonBenefit>\n<UID>lgot_1203<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24327.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1203<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-07-04<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<DocumentNumber>5158<\/DocumentNumber>\n<OriginalReceivedDate>2023-07-07<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2452877": "<ApplicationCommonBenefit>\n<UID>lgot_1201<\/UID>\n<DocumentTypeID>11<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24266.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<MedicalDocuments>\n<BenefitDocument>\n<DisabilityDocument>\n<UID>doc_lgot_1201<\/UID>\n<DocumentSeries>\u041c\u0421\u042d-2021<\/DocumentSeries>\n<DocumentNumber>1524318<\/DocumentNumber>\n<DisabilityTypeID>5<\/DisabilityTypeID>\n<DocumentOrganization>\u041e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0446\u0438\u044f<\/DocumentOrganization>\n<DocumentDate>2022-09-27<\/DocumentDate>\n<OriginalReceivedDate>2023-07-07<\/OriginalReceivedDate>\n<\/DisabilityDocument>\n<\/BenefitDocument>\n<\/MedicalDocuments>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2452843": "<ApplicationCommonBenefit>\n<UID>lgot_1214<\/UID>\n<DocumentTypeID>11<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24276.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<MedicalDocuments>\n<BenefitDocument>\n<DisabilityDocument>\n<UID>doc_lgot_1214<\/UID>\n<DocumentSeries>\u041c\u0421\u042d-2021<\/DocumentSeries>\n<DocumentNumber>1546570<\/DocumentNumber>\n<DisabilityTypeID>5<\/DisabilityTypeID>\n<DocumentOrganization>\u041e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0446\u0438\u044f<\/DocumentOrganization>\n<DocumentDate>2022-12-29<\/DocumentDate>\n<OriginalReceivedDate>2023-07-10<\/OriginalReceivedDate>\n<\/DisabilityDocument>\n<\/BenefitDocument>\n<\/MedicalDocuments>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2452774": "<ApplicationCommonBenefit>\n<UID>lgot_1197<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24253.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1197<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-07-03<\/DocumentDate>\n<DocumentName>\u0421\u043f\u0440\u0430\u0432\u043a\u0430<\/DocumentName>\n<DocumentOrganization>\u0412\u044b\u0434\u0430\u043d\u0430 \u041c\u0435\u0436\u0440\u0430\u0439\u043e\u043d\u043d\u044b\u043c \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435\u043c \u043c\u0438\u043d\u0438\u0441\u0442\u0435\u0440\u0441\u0442\u0432\u0430 \u0441\u043e\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044f, \u043e\u043f\u0435\u043a\u0438 \u0438 \u043f\u043e\u043f\u0435\u0447\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430 \u0418\u0440\u043a\u0443\u0442\u0441\u043a\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438 \u21161<\/DocumentOrganization>\n<DocumentNumber>4527\/23<\/DocumentNumber>\n<DocumentSeries>53-1<\/DocumentSeries>\n<OriginalReceivedDate>2023-07-07<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2452684": "<ApplicationCommonBenefit>\n<UID>lgot_1193<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24327.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1193<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2016-05-15<\/DocumentDate>\n<DocumentOrganization>\u041c\u0435\u0436\u0440\u0430\u0439\u043e\u043d\u043d\u043e\u0435 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u041c\u0438\u043d\u0438\u0441\u0442\u0435\u0440\u0441\u0442\u0432\u0430 \u0441\u043e\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044f, \u043e\u043f\u0435\u043a\u0438 \u0438 \u043f\u043e\u043f\u0435\u0447\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430 \u0418\u0440\u043a\u0443\u0442\u0441\u043a\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438 \u2116 1<\/DocumentOrganization>\n<DocumentSeries>6995<\/DocumentSeries>\n<OriginalReceivedDate>2023-07-06<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2452664": "<ApplicationCommonBenefit>\n<UID>lgot_1210<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24193.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1210<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-07-07<\/DocumentDate>\n<DocumentName>\u0441\u043f\u0440\u0430\u0432\u043a\u0430<\/DocumentName>\n<DocumentOrganization>\u043c\u0435\u0436\u0440\u0430\u0439\u043e\u043d\u043d\u043e\u0435 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043c\u0438\u043d\u0438\u0441\u0442\u0435\u0440\u0441\u0442\u0432\u0430 \u0441\u043e\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044f, \u043e\u043f\u0435\u043a\u0438 \u0438 \u043f\u043e\u043f\u0435\u0447\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430 \u0438\u0440\u043a\u0443\u0442\u0441\u043a\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438 \u2116 4<\/DocumentOrganization>\n<OriginalReceivedDate>2023-07-06<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2452588": "<ApplicationCommonBenefit>\n<UID>lgot_1272<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24294.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1272<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2016-05-15<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<OriginalReceivedDate>2023-07-06<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2452476": "<ApplicationCommonBenefit>\n<UID>lgot_1189<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24307.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1189<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-07-05<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<DocumentNumber>(53-2)-7\/23<\/DocumentNumber>\n<OriginalReceivedDate>2023-07-06<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2452020": "<ApplicationCommonBenefit>\n<UID>lgot_1182<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24307.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1182<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-03-30<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<DocumentNumber>128<\/DocumentNumber>\n<OriginalReceivedDate>2023-07-04<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2451977": "<ApplicationCommonBenefit>\n<UID>lgot_1181<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24193.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1181<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-06-27<\/DocumentDate>\n<DocumentName>\u0441\u043f\u0440\u0430\u0432\u043a\u0430<\/DocumentName>\n<DocumentOrganization>\u041c\u0435\u0436\u0440\u0430\u0439\u043e\u043d\u043d\u043d\u043e\u0435 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043c\u0438\u043d\u0438\u0441\u0442\u0435\u0440\u0441\u0442\u0432\u0430 \u0441\u043e\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044f, \u043e\u043f\u0435\u043a\u0438 \u0438 \u043f\u043e\u043f\u0435\u0447\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430 \u0418\u0440\u043a\u0443\u0442\u0441\u043a\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438 \u2116 3<\/DocumentOrganization>\n<DocumentNumber>03-05-07-416\/23<\/DocumentNumber>\n<OriginalReceivedDate>2023-07-04<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2451805": "<ApplicationCommonBenefit>\n<UID>lgot_1176<\/UID>\n<DocumentTypeID>11<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24330.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<MedicalDocuments>\n<BenefitDocument>\n<DisabilityDocument>\n<UID>doc_lgot_1176<\/UID>\n<DocumentSeries>\u041c\u0421\u042d-2021<\/DocumentSeries>\n<DocumentNumber>1513818<\/DocumentNumber>\n<DisabilityTypeID>5<\/DisabilityTypeID>\n<DocumentOrganization>\u041e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0446\u0438\u044f<\/DocumentOrganization>\n<DocumentDate>2023-04-07<\/DocumentDate>\n<OriginalReceivedDate>2023-07-03<\/OriginalReceivedDate>\n<\/DisabilityDocument>\n<\/BenefitDocument>\n<\/MedicalDocuments>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2451303": "<ApplicationCommonBenefit>\n<UID>lgot_1171<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24316.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1171<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-06-29<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<DocumentNumber>4719<\/DocumentNumber>\n<OriginalReceivedDate>2023-06-29<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2451181": "<ApplicationCommonBenefit>\n<UID>lgot_1169<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24294.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<MedicalDocuments>\n<BenefitDocument>\n<DisabilityDocument>\n<UID>doc_lgot_1169<\/UID>\n<DocumentSeries>\u041c\u0421\u042d-2018<\/DocumentSeries>\n<DocumentNumber>1214893<\/DocumentNumber>\n<DisabilityTypeID>5<\/DisabilityTypeID>\n<DocumentOrganization>\u041e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0446\u0438\u044f<\/DocumentOrganization>\n<DocumentDate>2021-03-10<\/DocumentDate>\n<OriginalReceivedDate>2023-06-29<\/OriginalReceivedDate>\n<\/DisabilityDocument>\n<\/BenefitDocument>\n<\/MedicalDocuments>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2451159": "<ApplicationCommonBenefit>\n<UID>lgot_1167<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24187.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1167<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-06-26<\/DocumentDate>\n<DocumentOrganization>\u041c\u0435\u0436\u0440\u0430\u0439\u043e\u043d\u043d\u043e\u0435 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043c\u0438\u043d\u0438\u0441\u0442\u0435\u0440\u0441\u0442\u0432\u0430 \u0441\u043e\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044f, \u043e\u043f\u0435\u043a\u0438 \u0438 \u043f\u043e\u043f\u0435\u0447\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430 \u0418\u0440\u043a\u0443\u0442\u0441\u043a\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438 \u21161<\/DocumentOrganization>\n<DocumentNumber>2966<\/DocumentNumber>\n<OriginalReceivedDate>2023-06-28<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2451141": "<ApplicationCommonBenefit>\n<UID>lgot_1166<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24327.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1166<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-05-18<\/DocumentDate>\n<DocumentOrganization>\u041c\u0435\u0436\u0440\u0430\u0439\u043e\u043d\u043d\u043e\u0435 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u041c\u0438\u043d\u0438\u0441\u0442\u0435\u0440\u0441\u0442\u0432\u0430 \u0441\u043e\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044f, \u043e\u043f\u0435\u043a\u0438 \u0438 \u043f\u043e\u043f\u0435\u0447\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430 \u0418\u0440\u043a\u0443\u0442\u0441\u043a\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438 \u2116 3<\/DocumentOrganization>\n<DocumentNumber>23<\/DocumentNumber>\n<DocumentSeries>263<\/DocumentSeries>\n<OriginalReceivedDate>2023-06-28<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2451047": "<ApplicationCommonBenefit>\n<UID>lgot_1191<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24268.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1191<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2016-05-15<\/DocumentDate>\n<DocumentName>\u0441\u0432-\u0432\u043e \u043e \u0440\u043e\u0436\u0434\u0435\u043d\u0438\u0438, \u0440\u0430\u0441\u043f\u043e\u0440\u044f\u0436\u0435\u043d\u0438\u0435<\/DocumentName>\n<DocumentOrganization>-<\/DocumentOrganization>\n<OriginalReceivedDate>2023-06-27<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2451035": "<ApplicationCommonBenefit>\n<UID>lgot_1280<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24324.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1280<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-07-18<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<DocumentNumber>5301<\/DocumentNumber>\n<OriginalReceivedDate>2023-06-27<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2450811": "<ApplicationCommonBenefit>\n<UID>lgot_1165<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24354.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1165<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-06-24<\/DocumentDate>\n<DocumentOrganization>\u041c\u0438\u043d\u0438\u0441\u0442\u0435\u0440\u0441\u0442\u0432\u043e \u0441\u043e\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044f, \u043e\u043f\u0435\u043a\u0438 \u0438 \u043f\u043e\u043f\u0435\u0447\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430 \u0418\u0440\u043a\u0443\u0442\u0441\u043a\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438. \u041c\u0435\u0436\u0440\u0430\u0439\u043e\u043d\u043d\u043e\u0435 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u041c\u0438\u043d\u0438\u0441\u0442\u0435\u0440\u0441\u0442\u0432\u0430 \u0441\u043e\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044f,\u043e\u043f\u0435\u043a\u0438 \u0438 \u043f\u043e\u043f\u0435\u0447\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430 \u0418\u0440\u043a\u0443\u0442\u0441\u043a\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438 \u21167 \u0433.\u0411\u0440\u0430\u0442\u0441\u043a, \u041e\u0442\u0434\u0435\u043b \u043e\u043f\u0435\u043a\u0438 \u0438 \u043f\u043e\u043f\u0435\u0447\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430 \u0433\u0440\u0430\u0436\u0434\u0430\u043d \u043f\u043e \u0423\u0441\u0442\u044c-\u041a\u0443\u0442\u0441\u043a\u043e\u043c\u0443 \u0440\u0430\u0439\u043e\u043d\u0443.<\/DocumentOrganization>\n<DocumentNumber>02-0865\/23<\/DocumentNumber>\n<OriginalReceivedDate>2023-06-23<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2450783": "<ApplicationCommonBenefit>\n<UID>lgot_1157<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24214.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1157<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-06-02<\/DocumentDate>\n<DocumentName>\u0441\u043f\u0440\u0430\u0432\u043a\u0430<\/DocumentName>\n<DocumentOrganization>\u0410\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f \u041c\u041e \"\u041a\u0443\u0431\u0430\u043d\u0441\u043a\u0438\u0439 \u0440\u0430\u0439\u043e\u043d\" \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0438 \u0411\u0443\u0440\u044f\u0442\u0438\u044f<\/DocumentOrganization>\n<DocumentNumber>319<\/DocumentNumber>\n<OriginalReceivedDate>2023-06-22<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2450777": "<ApplicationCommonBenefit>\n<UID>lgot_1156<\/UID>\n<DocumentTypeID>11<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>adm:24195.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<MedicalDocuments>\n<BenefitDocument>\n<DisabilityDocument>\n<UID>doc_lgot_1156<\/UID>\n<DocumentSeries>\u041c\u0421\u042d-2021<\/DocumentSeries>\n<DocumentNumber>1532279<\/DocumentNumber>\n<DisabilityTypeID>5<\/DisabilityTypeID>\n<DocumentOrganization>\u0424\u041a\u0423 \"\u0413\u0411 \u041c\u0421\u042d \u043f\u043e \u0418\u0440\u043a\u0443\u0442\u0441\u043a\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438\" \u041c\u0438\u043d\u0442\u0440\u0443\u0434\u0430 \u0420\u043e\u0441\u0441\u0438\u0438 \u0411\u044e\u0440\u043e\u21161 - \u0444\u0438\u043b\u0438\u0430\u043b<\/DocumentOrganization>\n<DocumentDate>2022-09-05<\/DocumentDate>\n<OriginalReceivedDate>2023-06-22<\/OriginalReceivedDate>\n<\/DisabilityDocument>\n<\/BenefitDocument>\n<\/MedicalDocuments>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2459114": "<ApplicationCommonBenefit>\n<UID>lgot_1287<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>dopadm:24327.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1287<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-07-18<\/DocumentDate>\n<DocumentOrganization>\u041c\u0435\u0436\u0440\u0430\u0439\u043e\u043d\u043d\u043e\u0435 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u041c\u0438\u043d\u0438\u0441\u0442\u0435\u0440\u0441\u0442\u0432\u0430 \u0441\u043e\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044f, \u043e\u043f\u0435\u043a\u0438 \u0438 \u043f\u043e\u043f\u0435\u0447\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430 \u0418\u0440\u043a\u0443\u0442\u0441\u043a\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438 \u2116 3<\/DocumentOrganization>\n<OriginalReceivedDate>2023-08-26<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2456797": "<ApplicationCommonBenefit>\n<UID>lgot_1228<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>dopadm:24307.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1228<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-07-10<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<DocumentNumber>2979\/23<\/DocumentNumber>\n<DocumentSeries>53-3<\/DocumentSeries>\n<OriginalReceivedDate>2023-08-15<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2456580": "<ApplicationCommonBenefit>\n<UID>lgot_1289<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>dopadm:24214.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1289<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-07-06<\/DocumentDate>\n<DocumentName>\u0441\u043f\u043f\u0440\u0430\u0432\u043a\u0430<\/DocumentName>\n<DocumentOrganization>\u041c\u0438\u043d\u0438\u0441\u0442\u0435\u0440\u0441\u0442\u0432\u043e \u0441\u043e\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044f, \u043e\u043f\u0435\u043a\u0438 \u0438 \u043f\u043e\u043f\u0435\u0447\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430 \u0418\u041e \u041c\u0435\u0436\u0440\u0430\u0439\u043e\u043d\u043d\u043e\u0435 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u041c\u0438\u043d\u0438\u0441\u0442\u0435\u0440\u0441\u0442\u0432\u0430 \u0441\u043e\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044f, \u043e\u043f\u0435\u043a\u0438 \u0438 \u043f\u043e\u043f\u0435\u0447\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430 \u0418\u041e \u2116 1<\/DocumentOrganization>\n<DocumentNumber>5013<\/DocumentNumber>\n<OriginalReceivedDate>2023-08-15<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2454180": "<ApplicationCommonBenefit>\n<UID>lgot_1227<\/UID>\n<DocumentTypeID>11<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>dopadm:24278.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<MedicalDocuments>\n<BenefitDocument>\n<DisabilityDocument>\n<UID>doc_lgot_1227<\/UID>\n<DocumentSeries>\u041c\u0421\u042d-2019<\/DocumentSeries>\n<DocumentNumber>1965963<\/DocumentNumber>\n<DisabilityTypeID>5<\/DisabilityTypeID>\n<DocumentOrganization>\u041e\u0440\u0433\u0430\u043d\u0438\u0437\u0430\u0446\u0438\u044f<\/DocumentOrganization>\n<DocumentDate>2003-07-16<\/DocumentDate>\n<OriginalReceivedDate>2023-07-27<\/OriginalReceivedDate>\n<\/DisabilityDocument>\n<\/BenefitDocument>\n<\/MedicalDocuments>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2453445": "<ApplicationCommonBenefit>\n<UID>lgot_1212<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>dopadm:24307.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1212<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-07-07<\/DocumentDate>\n<DocumentOrganization>\u041c\u0435\u0436\u0440\u0430\u0439\u043e\u043d\u043d\u043e\u0435 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u041c\u0438\u043d\u0438\u0441\u0442\u0435\u0440\u0441\u0442\u0432\u0430 \u0441\u043e\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044f, \u043e\u043f\u0435\u043a\u0438 \u0438 \u043f\u043e\u043f\u0435\u0447\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430 \u0418\u0440\u043a\u0443\u0442\u0441\u043a\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438<\/DocumentOrganization>\n<DocumentNumber>43<\/DocumentNumber>\n<OriginalReceivedDate>2023-07-10<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2453077": "<ApplicationCommonBenefit>\n<UID>lgot_1205<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>dopadm:24307.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1205<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-07-04<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<DocumentNumber>5140<\/DocumentNumber>\n<OriginalReceivedDate>2023-07-08<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2452861": "<ApplicationCommonBenefit>\n<UID>lgot_1286<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>dopadm:24307.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1286<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-07-13<\/DocumentDate>\n<DocumentOrganization>\u041c\u0435\u0436\u0440\u0430\u0439\u043e\u043d\u043d\u043e\u0435 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u041c\u0438\u043d\u0438\u0441\u0442\u0435\u0440\u0441\u0442\u0432\u0430 \u0441\u043e\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044f, \u043e\u043f\u0435\u043a\u0438 \u0438 \u043f\u043e\u043f\u0435\u0447\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430 \u0418\u0440\u043a\u0443\u0442\u0441\u043a\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438 \u2116 1<\/DocumentOrganization>\n<DocumentNumber>5170<\/DocumentNumber>\n<OriginalReceivedDate>2023-07-07<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2451584": "<ApplicationCommonBenefit>\n<UID>lgot_1177<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>dopadm:24214.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<OrphanDocument>\n<UID>doc_lgot_1177<\/UID>\n<OrphanCategoryID>8<\/OrphanCategoryID>\n<DocumentDate>2023-07-03<\/DocumentDate>\n<DocumentName>\u0441\u043f\u0440\u0430\u0432\u043a\u0430<\/DocumentName>\n<DocumentOrganization>\u041c\u0435\u0436\u0440\u0430\u0439\u043e\u043d\u043d\u043e\u0435 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u041c\u0438\u043d\u0438\u0441\u0442\u0435\u0440\u0441\u0442\u0432\u0430 \u0441\u043e\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0433\u043e \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044f, \u043e\u043f\u0435\u043a\u0438 \u0438 \u043f\u043e\u043f\u0435\u0447\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u0430 \u0418\u0440\u043a\u0443\u0442\u0441\u043a\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438<\/DocumentOrganization>\n<DocumentNumber>\u0418\u0441\u0445(53-3)-2874\/23<\/DocumentNumber>\n<OriginalReceivedDate>2023-07-03<\/OriginalReceivedDate>\n<\/OrphanDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n",
            "2451012": "<ApplicationCommonBenefit>\n<UID>lgot_1199<\/UID>\n<DocumentTypeID>15<\/DocumentTypeID>\n<BenefitKindID>4<\/BenefitKindID>\n<CompetitiveGroupUID>dopadm:24254.2<\/CompetitiveGroupUID>\n<DocumentReason>\n<VeteranDocument>\n<UID>doc_lgot_1199<\/UID>\n<VeteranCategoryID>1<\/VeteranCategoryID>\n<DocumentDate>2010-09-01<\/DocumentDate>\n<DocumentOrganization>-<\/DocumentOrganization>\n<DocumentNumber>117086<\/DocumentNumber>\n<DocumentSeries>\u0412\u0412<\/DocumentSeries>\n<OriginalReceivedDate>2023-07-07<\/OriginalReceivedDate>\n<\/VeteranDocument>\n<\/DocumentReason>\n<\/ApplicationCommonBenefit>\n"
        }
        return map[aisId]
    }

}


