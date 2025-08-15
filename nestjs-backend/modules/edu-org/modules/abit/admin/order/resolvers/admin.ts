import {Args, Info, Mutation, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {Response} from "~lib/response";

import {ReturnModelType} from "@typegoose/typegoose";

import {AbitOrderModel as Model} from "../../../core/order/model"
import {AbitOrderService as ModelCoreService} from "../../../core/order/service"

import {MailService} from "~modules/mail/mail.service";
import {AbitOrderCollection} from "../../../core/order/collection";
import {EduInstituteService} from "~modules/edu-org/modules/institute/core/service";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "~modules/user/core/guards/userRolesAdminGuard";
import {EduDecreeService} from "~modules/edu-org/modules/decree/core/service";

@UseGuards(UserRolesAdminGuard)
@Resolver('EduOrder')
export class AbitOrderAdminAdminResolvers {

    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private mailService: MailService,
        private eduInstituteService: EduInstituteService,
        private eduDecreeService: EduDecreeService,
    ) {
    }



    @Mutation('edu_order_admin__edu_set_original')
    async eduSetOriginal(@Args() args: any, @Info() info) {
        let response = new Response();
        const doc = await this.coreService.query().getById(args.id)
        if (doc) {
            doc.podldoc = args.status
            doc.podldocUpdated = new Date()
            response.addSuccess('Статус подлинника изменен на: ' + (args.status ? 'ПРЕДОСТАВЛЕН' : 'НЕ ПРЕДОСТАВЛЕН'), {notify: true})
            await doc.savePromise()
        }
        try {

        } catch (e) {
            response.addError(e.message, {notify: true})
        }
        return response.getJson()
    }

    @Mutation('edu_order_admin_changeOperator')
    async changeOperator(@Args() args: any, @Info() info) {

        let response = new Response();

        try {

            const docs: AbitOrderCollection = await this.coreService.query().filterIds(args).execCollection(AbitOrderCollection)

            for (const doc of docs.checkIds(args).all()) {
                if (doc.coperator) {
                    doc.coperator = args.operatorId
                    await doc.savePromise()
                    response.addSuccess('Заявление ' + doc.nid + ' - оператор изменен', {notify: true})
                } else {
                    response.addWarning('Заявление ' + doc.nid + ' - оператор не изменен, т.к. не задан ранее', {notify: true})
                }
            }

        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }

    @Mutation('edu_order_admin_changeInstitute')
    async changeInstitute(@Args() args: any, @Info() info) {

        let response = new Response();

        try {
            const docs: AbitOrderCollection = await this.coreService.query().filterIds(args).execCollection(AbitOrderCollection)

            const institute = await this.eduInstituteService.query().filterIds({id: args.instituteId}).findOne().exec()

            if (institute) {
                for (const doc of docs.checkIds(args).all()) {
                    doc.cinstitute = institute.id
                    await doc.savePromise()
                    response.addSuccess('Заявление №' + doc.nid + ' - факультет изменен', {notify: true})
                }
            }

        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }

    @Mutation('edu_order_admin_changeDecree')
    async changeDecree(@Args() args: any, @Info() info) {

        let response = new Response();

        try {
            const docs: AbitOrderCollection = await this.coreService.query().filterIds(args).execCollection(AbitOrderCollection)

            const decree = await this.eduDecreeService.findOneBy('nid', args.decreeNid)

            if (decree) {
                for (const doc of docs.checkIds(args).all()) {
                    doc.decreeNid = decree.nid
                    await doc.savePromise()
                    response.addSuccess('Заявление №' + doc.nid + ' - приказ изменен', {notify: true})
                }
            }

        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }

    @Mutation('edu_order_admin_fileAdd')
    async fileAdd(@Args() args: any, @Info() info) {

        let response = new Response();

        try {
            //const order = await (new ModelQuery(this.model.findOne({_id: mongoose.Types.ObjectId(args.orderId)}))).withViewPublic().exec()

            // await file.savePromise()

        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }

    @Mutation('edu_order_admin_fileUpdate')
    async fileUpdate(@Args() args: any, @Info() info) {

        let response = new Response();

        try {
            const docs: AbitOrderCollection = await this.coreService.query().filterIds(args).execCollection(AbitOrderCollection)

            const institute = await this.eduInstituteService.query().filterIds({id: args.instituteId}).findOne().exec()

            if (institute) {
                for (const doc of docs.checkIds(args).all()) {
                    doc.cinstitute = institute.id
                    await doc.savePromise()
                    response.addSuccess('Заявление ' + doc.nid + ' - факультет изменен', {notify: true})
                }
            }

        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }

    @Mutation('edu_order_admin_update')
    async adminUpdate(
        @Args() args: any,
        @Info() info
    ) {

        let response = new Response();

        try {

            let order = await this.coreService.query().getById(args._id)

            const sections: any = args.model


            if (sections.personal) {
                const section = sections.personal
                order.anket.personal.inn = section.inn
                order.anket.personal.snils = section.snils
                order.anket.personal.citizenship = section.citizenship
                order.anket.personal.citizenshipCountry = section.citizenshipCountry
                order.anket.personal.firstName = section.firstName
                order.anket.personal.lastName = section.lastName
                order.anket.personal.secondName = section.secondName

                order.anket.personal.birthday = section.birthday
                order.anket.personal.birthplace = section.birthplace
                order.anket.personal.gender = section.gender
                order.anket.personal.needFlat = section.needFlat
            }

            if (sections.target) {
                const section = sections.target
                order.anket.entrance.targetHave = section.targetHave
                order.anket.entrance.targetOrganization = section.targetOrganization
                order.anket.entrance.targetDogovor = section.targetDogovor
            }

            if (sections.dul) {
                const section = sections.dul
                order.anket.personal.doc.serial = section.serial
                order.anket.personal.doc.number = section.number
            }

            if (sections.education) {
                const section = sections.education
                order.anket.education.prevEduLevel = section.prevEduLevel

                if (typeof section.irnituEdu2020 !== "undefined")
                    order.anket.education.irnituEdu2020 = section.irnituEdu2020

                if (typeof section.specialty !== "undefined")
                    order.anket.education.specialty = section.specialty

                order.anket.education.docCountryType = section.docCountryType
                order.anket.education.docCity = section.docCity

                order.anket.personal.languages = section.languages
                order.anket.personal.languageCustom = section.languageCustom
            }

            if (sections.contacts) {
                const section = sections.contacts
                order.anket.personal.email = section.email
                order.anket.personal.phone = section.phone
                order.anket.personal.phone2 = section.phone2
            }

            if (sections.address) {
                const section = sections.address
                order.anket.personal.addressEqual = section.addressEqual
                order.anket.personal.addressLive = section.addressLive
                order.anket.personal.addressReg = section.addressReg
            }

            await order.savePromise()

            response.addSuccess('Заявление сохранено', {notify: true})

        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }
}
