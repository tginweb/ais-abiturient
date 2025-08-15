import {modelOptions} from "@typegoose/typegoose";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";
import {formatToEpguDate, formatToEpguDatetime} from "~modules/edu-org/modules/epgu/core/util";
import {AppStatusEnum} from "~modules/edu-org/modules/abit/core/app/enum";
import {cisCitizenTypeEnum} from "~modules/edu-org/enum/ais-student-status";

const dayjs = require('dayjs')
const trim = require('locutus/php/strings/trim')

interface DocArgs {
    snils: string
    guid: string
}

@modelOptions({
    schemaOptions: {
        collection: "epgu_message",
        discriminatorKey: "type",
    }
})
export class ApplicationListAdd extends EduEpguMessageModel {

    get epguEntityType() {
        return 'ApplicationList'
    }

    get epguAction() {
        return 'Add'
    }

    getArgs(): DocArgs {
        return this.args
    }

    async getPackets(entity: AbitOrderModel, IdObjects) {

        entity.addContext(this.service.abitOrderService.modelContext())

        const applications = []

        //if (!entity.anket.personal.snils) return []

        await entity.getEpguIdentDoc()

        const identDoc = await entity.getEpguIdentDoc()
        const eduDoc = await entity.getEpguEduDoc()


        console.log('111')
        if (!identDoc || !identDoc.docTypeId)
            return [];

        console.log('2222')
        for (const appGroup of await entity.getAppGroups()) {

            if (!appGroup.isDopnabor) {
                continue;
            }
            console.log('333')

            const application: any = {
                OgrnOwnerOrganization: 1023801756120,
                KppOwnerOrganization: 381201001,
            }

            application.EntrantChoice = {}

            if (!entity.epgu.guid) {

                const docSeries = (identDoc.docSeries || '').trim().replace(/\s/gi, '')
                const docNumber = (identDoc.docNumber || '').trim().replace(/[^\d]/gi, '')
                const identOkcm = identDoc.getOkcmId()


                if (!docNumber)
                    return [];

                if (entity.anket.personal.citizenship !== cisCitizenTypeEnum.RUSSIA) {
                  //  return [];
                }

                application.EntrantChoice.AddEntrant = {
                    Identification: {
                        IdDocumentType: identDoc.docTypeId,
                        DocName: identDoc.docName || identDoc.docTypeName,
                        DocNumber: docNumber,
                        IssueDate: formatToEpguDate(identDoc.issueDate),
                        DocOrganization: identDoc.docOrg,
                        Fields: {
                            IdOksm: identOkcm,
                            Surname: (identDoc.fields['Surname'] || entity.anket.personal.lastName).trim(),
                            Name: (identDoc.fields['Name'] || entity.anket.personal.firstName).trim(),
                            Patronymic: (identDoc.fields['Patronymic'] || entity.anket.personal.secondName).trim(),
                        }
                    },
                    IdGender: entity.anket.personal.gender === 'male' ? 1 : 2,
                    Birthday: formatToEpguDate(entity.anket.personal.birthday),
                    Birthplace: entity.anket.personal.birthplace,
                    IdOksm: (await entity.getEpguCitizenshipCountryId()) || identOkcm
                }

                if (docSeries) {
                    application.EntrantChoice.AddEntrant.Identification.DocSeries = docSeries
                }

                if (identDoc.subdivisionCodeFormatted && identDoc.docTypeId !== 100040) {
                    application.EntrantChoice.AddEntrant.Identification.Fields.SubdivisionCode = identDoc.subdivisionCodeFormatted
                }

                if (entity.snilsReal) {
                    application.EntrantChoice.AddEntrant.Snils = entity.snilsReal
                }

            } else {
                application.EntrantChoice.Guid = entity.epgu.guid
            }


            //application.RegistrationDate = formatToEpguDatetime(appGroup.registerAt || entity.sendDate || appGroup.createAt, 'jsdate')
            application.RegistrationDate = formatToEpguDatetime('16.08.2023', 'cis_date')
            application.FirstHigherEducation = 'true'
            application.NeedHostel = entity.anket.personal.needFlat ? 'true' : 'false'
            application.AllowedForEpgu = 'true'
            application.IdStageAdmission = 4
            application.IsBudget = appGroup.isBudget
            application.ExtraTestAttribute = (await entity.getEpguExtraTestAttribute()) ? 'true' : 'false'

            const competitions = []

            const apps = await appGroup.getActiveAppsCollection()

            for (const app of apps.all()) {

                if (!app.competitionUid.match(/dopadm/))
                    continue;

                //if (app.csource !== 1) continue;

                let statusId

                if (
                    app.statusId === AppStatusEnum.COMPET_MEMBER ||
                    app.statusId === AppStatusEnum.PENDING
                ) {
                    statusId = app.statusId
                } else if (app.statusId === AppStatusEnum.INORDER) {
                    statusId = AppStatusEnum.COMPET_MEMBER
                } else {
                    continue;
                }

                const appCompet: any = {
                    UidCompetition: app.competitionUid,
                    IdStatus: statusId,
                    Priority: {}
                }

                if (app.csource === 4) {
                    appCompet.Priority.PriorityTarget = app.priorityTarget || app.priority
                } else {
                    appCompet.Priority.PriorityOther = app.priority
                }

                competitions.push(appCompet)
            }

            if (!competitions.length)
                continue;

            application.AddCompetitiveGroupList = {
                AddCompetitiveGroup: competitions
            }

            IdObjects.push(appGroup.id)
            application.IdObject = IdObjects.length

            applications.push(application)
        }

        return applications

    }

    async generatePayload() {

        return {
            'ApplicationList': {
                'Application': []
            }
        }
    }

    async onProcessResult() {

        /*
        let order: AbitOrderModel = await this.getArgEntity()
        const payload: any = this.response.payload

        const app = payload?.SuccessResultList?.Application

        order.epgu.guid = app.GuidEntrant
        await order.savePromise()
         */

        return true
    }

}


