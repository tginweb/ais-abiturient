import {Args, Info, Mutation, Query, Resolver} from '@nestjs/graphql';
import {BadRequestException, UseGuards} from "@nestjs/common";
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {AbitOrderModel, AbitOrderModel as Model} from "./../../core/order/model"
import {AbitOrderByUser} from "./decorator";
import {AbitOrderByUserGuard} from "./guard";
import {Response} from "~lib/response";
import {Quota} from "~modules/edu-org/modules/abit/core/order/subdoc/anket/benefits/quota";
import {ItemFamily} from "~modules/edu-org/modules/abit/core/order/subdoc/anket/personal/item-family";
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";
import {AbitOrderPublicService} from "./service";
import {AbitOrderService} from "../../core/order/service";
import {UserService} from "~modules/user/core/user.service";
import {EduDocModel} from "~modules/edu-org/modules/doc/core/model";
import {EduDocService} from "~modules/edu-org/modules/doc/core/service";
import {AbitWorkplaceEnum} from "~modules/edu-org/enum/source-workplace";
import {FileService} from "~modules/file/core/service";
import {EduAdmissionService} from "~modules/edu-org/modules/admission/core/service";
import {EduAchievementService} from "~modules/edu-org/modules/achievement/core/type/service";
import {EduAchievementItemModel} from "~modules/edu-org/modules/achievement/core/item/model";
import {EduAchievementItemService} from "~modules/edu-org/modules/achievement/core/item/service";
import {EduSubjectService} from "~modules/edu-org/modules/subject/core";
import {AbitTestService} from "~modules/edu-org/modules/abit/core/test";
import {UserRolesAdminGuard} from "../../../../../user/core/guards/userRolesAdminGuard";

const ns = 'edu_order_public__'

@UseGuards(AbitOrderByUserGuard)
@Resolver('EduOrder')
export class AbitOrderPublicResolvers {

    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: AbitOrderService,
        private readonly publicService: AbitOrderPublicService,
        private readonly userService: UserService,
        private readonly docService: EduDocService,
        private readonly fileService: FileService,
        private readonly admissionService: EduAdmissionService,
        private readonly achievementService: EduAchievementService,
        private readonly achievementItemService: EduAchievementItemService,
        private readonly eduSubjectService: EduSubjectService,
        private readonly abitTestService: AbitTestService,
    ) {
    }

    @Query(ns + 'fetch_by_user')
    async fetchByUser(@Args() args, @Info() info, @AbitOrderByUser() order: AbitOrderModel) {
        return order
    }

    @Query(ns + 'available_admissions')
    async availableAdmissions(@Args() args, @Info() info, @AbitOrderByUser() order: AbitOrderModel) {
        return await this.admissionService.query().where({clevel: {$in: order.eduLevels}}).withViewPublic().exec()
    }

    @Query(ns + 'doc')
    async fetchDoc(@Args() args, @Info() info, @AbitOrderByUser() order: AbitOrderModel) {
        const doc = await this.docService.query().getById(args.id)
        if (doc.orderId === order.id) {
            return doc
        }
    }

    @Query(ns + 'docs')
    async fetchDocs(@Args() args, @Info() info, @AbitOrderByUser() order: AbitOrderModel) {

        return order.getDocs()
    }


    @Mutation(ns + 'create')
    async create(
        @Args() args,
        @Info() info,
        @AbitOrderByUser() order: Model,
        @UserCurrent() user: UserModel
    ) {

        let result = new Response();

        try {

            if (!user) {
                throw new BadRequestException('Вы не авторизованы')
            }

            if (!order) {
                order = await this.publicService.ensureByUser(user, user.eduType || 2, true)
            }

        } catch (e) {
            console.log(e)
            result.addError(e.message)
        }

        return result.getJson()
    }

    @Mutation(ns + 'type_change')
    async typeChange(@Args() args, @Info() info, @AbitOrderByUser() order: Model) {

        let response = new Response();

        try {

            if (order.state.status === 'draft') {

                console.log(args)

                await this.userService.updateUserEduType(order.userId, args.orderType)

                order.eduType = args.orderType
                order.anket.education.docType = null
                order.applications.items = []
                order.anket.entrance.achievements = []
                order.anket.entrance.subjects = []
                order.anket.benefits.quotes = []

                await order.savePromise()
            }

            response.addSuccess('Уровень образования заявления успешно изменен', {notify: true})

        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }

    @Mutation(ns + 'send_agreement')
    async sendAgreement(@Args('data') data, @AbitOrderByUser() order: Model, @UserCurrent() user: UserModel) {

        let response = new Response();

        try {

            if (order.eduTypeSlug === 'bak') {

                let haveZaoch = false

                for (const app of order.applications.items) {

                    if (app.admission && app.admission['cfob'] === 2)
                        haveZaoch = true
                }

                if (!haveZaoch) {
                    // throw new BadRequestException('Прием согласий по очной форме уровня бакалавриат-специалитет завершен')
                }
            }

            let status = order.getStateStatusInfo();

            order.applications.items.forEach((app) => {
                app.agree = false
                app.agreeDeny = false

                if (app.statusId === 18) {
                    app.statusId = null
                }
            })

            if (data.apply) {
                if (!order.allFiles.find(item => item.path === 'send.agreementDocFile' && (item.file && item.file.length))) {
                    throw new BadRequestException('Не загружен скан согласия')
                }
                const applyApp = order.applications.items.find(app => app._id == data.applyAppId)
                if (applyApp) {
                    applyApp.agree = true
                    applyApp.agreeDate = new Date()
                    applyApp.statusId = 18
                }
            }

            if (data.deny) {
                if (!order.allFiles.find(item => item.path === 'send.agreementDenyDocFile' && (item.file && item.file.length))) {
                    throw new BadRequestException('Не загружен скан отказа')
                }
                const denyApp = order.applications.items.find(app => app._id == data.denyAppId)
                if (denyApp) {
                    denyApp.agreeDeny = true
                    denyApp.agreeDenyDate = new Date()
                    denyApp.statusId = 13
                }
            }


            if (data.apply) {
                order.setStatus({status: 'agreement_apply'})
            } else {
                order.setStatus({status: 'agreement_deny'})
            }

            order.agreementChanged = true
            order.agreementChangedDate = new Date()

            await order.savePromise()


            response.addSuccess('Успешно сохранено', {notify: true})
        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }

    @Mutation(ns + 'send')
    async send(@Args() args, @Info() info, @AbitOrderByUser() order: Model) {

        let response = new Response();

        try {

            let status = order.getStateStatusInfo()

            if (!status.canEdit) {
                throw new BadRequestException('Ваше заявление уже в статусе Отправлено')
            }

            const apps = await order.getAppsCollection()

            if (order.eduTypeSlug === 'bak') {
                if (order.state.status === 'draft') {
                    if (apps.findOchBudget()) {
                        //if (foundBudgetOch) throw new BadRequestException('Прием на очную форму обучения бюджетной основы по программам бакалавриата и специалитета завершен. Отредактируйте список Ваших заявлений.')
                    }
                    if (apps.findZaochBudget()) {
                        //if (foundBudgetZaoch) throw new BadRequestException('Прием на заочную форму обучения бюджетной основы по программам бакалавриата и специалитета завершен. Отредактируйте список Ваших заявлений.')
                    }
                }
            }

            if (!order.setSended(order.userId)) {
                throw new BadRequestException('Ошибка')
            }

            await order.savePromise();

            response.addSuccess('Заявление отправлено в вуз', {notify: true})

        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }

    @Mutation(ns + 'section_update')
    async sectionUpdate(@Args() args, @Info() info, @AbitOrderByUser() order: Model) {

        let response = new Response();

        const section = args.section
        const data = args.data

        switch (section) {
            case 'personal':

                if (data.inn)
                    order.anket.personal.inn = data.inn

                if (data.snils)
                    order.anket.personal.snils = data.snils

                order.anket.personal.citizenship = data.citizenship
                order.anket.personal.citizenshipCountry = data.citizenshipCountry

                order.anket.personal.firstName = data.firstName
                order.anket.personal.lastName = data.lastName
                order.anket.personal.secondName = data.secondName

                order.anket.personal.birthday = data.birthday
                order.anket.personal.birthplace = data.birthplace
                order.anket.personal.gender = data.gender

                order.anket.personal.needFlat = data.needFlat

                break

            case 'address':
                order.anket.personal.email = data.email
                order.anket.personal.phone = data.phone
                order.anket.personal.phone2 = data.phone2
                order.anket.personal.addressEqual = data.addressEqual
                order.anket.personal.addressLive = data.addressLive
                order.anket.personal.addressReg = data.addressReg
                break

            case 'education':
                order.anket.education.prevEduLevel = data.prevEduLevel
                order.anket.education.irnituEdu2020 = data.irnituEdu2020
                order.anket.education.specialty = data.specialty
                order.anket.education.level = data.level
                order.anket.education.docType = data.docType
                order.anket.education.docCountryType = data.docCountryType
                order.anket.education.docCity = data.docCity

                order.anket.personal.languages = data.languages
                order.anket.personal.languageCustom = data.languageCustom
                break

            case 'entrance':
                order.anket.entrance.schoolCertificateBall = data.schoolCertificateBall
                order.anket.entrance.specialNeeds = data.specialNeeds
                order.anket.entrance.targetHave = data.targetHave
                order.anket.entrance.targetOrganization = data.targetOrganization
                order.anket.entrance.targetDogovor = data.targetDogovor
                break

            case 'other':


                break
        }

        try {
            await order.savePromise();
            response.addSuccess('Успешно сохранено', {notify: true})
        } catch (e) {
            throw new BadRequestException('Ошибка сохранения')
        }

        response.setPayloadData('quotes', order.anket.benefits.quotes)

        return response.getJson()
    }

    @Mutation(ns + 'family_update')
    async familyUpdate(@Args() args, @Info() info, @AbitOrderByUser() order: Model) {

        let response = new Response();

        let inputModel = args.model

        let subdoc: any = {}

        if (inputModel._id) {
            subdoc = order.anket.personal.family['id'](inputModel._id);
        } else {
            order.anket.personal.family.push(<ItemFamily>{})
            subdoc = order.anket.personal.family[order.anket.personal.family.length - 1]
        }

        subdoc.set({
            familyType: inputModel.familyType,
            fio: inputModel.fio,
            phone: inputModel.phone,
            email: inputModel.email,
            address: inputModel.address,
            work: inputModel.work,
        })

        try {
            await order.savePromise();
            response.addSuccess('Успешно сохранено', {notify: true})
        } catch (e) {
            throw new BadRequestException('Ошибка сохранения')
        }

        response.setPayloadData('quotes', order.anket.personal.family)

        return response.getJson()
    }

    @Mutation(ns + 'quota_delete')
    async quotaDelete(@Args() args, @Info() info, @AbitOrderByUser() order: Model) {

        let response = new Response();

        order.anket.benefits.quotes['pull']({
            _id: args.id
        })

        try {
            await order.savePromise();
            response.addSuccess('Успешно сохранено', {notify: true})
        } catch (e) {
            throw new BadRequestException('Ошибка сохранения')
        }

        response.setPayloadData('quotes', order.anket.benefits.quotes)

        return response.getJson()
    }

    @Mutation(ns + 'quota_update')
    async quotaUpdate(@Args() args, @Info() info, @AbitOrderByUser() order: Model) {

        let response = new Response();

        let inputModel = args.model

        let subdoc: any = {}

        if (inputModel._id) {
            subdoc = order.anket.benefits.quotes['id'](inputModel._id);
        } else {
            order.anket.benefits.quotes.push(<Quota>{})
            subdoc = order.anket.benefits.quotes[order.anket.benefits.quotes.length - 1]
        }

        subdoc.set({
            quotaType: inputModel.quotaType,
            haveDoc: inputModel.haveDoc,
            doc: inputModel.doc,
        })

        try {
            await order.savePromise();
            response.addSuccess('Успешно сохранено', {notify: true})
        } catch (e) {
            throw new BadRequestException('Ошибка сохранения')
        }

        response.setPayloadData('quotes', order.anket.benefits.quotes)

        return response.getJson()
    }

    @Mutation(ns + 'doc_delete')
    async docDelete(@Args() args, @Info() info, @AbitOrderByUser() order: Model) {

        let response = new Response();

        const docs = await order.getDocs()

        try {
            console.log(args)

            for (const doc of docs) {
                if (doc.id === args.id && doc.canDeleteAbit) {
                    await doc.deletePromise()
                }
            }
            response.addSuccess('Успешно удалено', {notify: true})
        } catch (e) {
            throw new BadRequestException('Ошибка сохранения')
        }

        response.setPayloadData('achievements', order.anket.entrance.achievements)

        return response.getJson()
    }


    @Mutation(ns + 'achievement_delete')
    async achievementDelete(@Args() args, @Info() info, @AbitOrderByUser() order: Model) {

        let response = new Response();

        order.anket.entrance.achievements['pull']({_id: args.id})

        try {
            await order.savePromise();
            response.addSuccess('Успешно сохранено', {notify: true})
        } catch (e) {
            throw new BadRequestException('Ошибка сохранения')
        }

        response.setPayloadData('achievements', order.anket.entrance.achievements)

        return response.getJson()
    }

    @Mutation(ns + 'achievement_update')
    async achievementUpdate(@Args() args, @Info() info, @AbitOrderByUser() order: Model) {

        let result = new Response();

        try {

            let doc: EduAchievementItemModel

            if (args.action === 'create') {
                doc = this.achievementItemService.createModel({})
                doc.orderId = order.id
            } else {
                doc = await this.achievementItemService.query().getById(args.id)
            }

            const model = args.model

            doc.typeId = model.typeId
            doc.docId = model.docId

            console.log(doc)

            await doc.savePromise()

            result.setPayloadData('entityId', doc._id)

            result.addSuccess('Документ сохранен')

        } catch (e) {
            throw new BadRequestException('Ошибка сохранения')
        }

        return result.getJson()
    }

    @Mutation(ns + 'subject_delete')
    async subjectDelete(@Args() args, @Info() info, @AbitOrderByUser() order: any) {

        let response = new Response();

        let doc = order.getDoc();

        doc.anket.entrance.subjects.pull({_id: args.id})

        try {
            await order.savePromise();
            response.addSuccess('Успешно сохранено', {notify: true})
        } catch (e) {
            throw new BadRequestException('Ошибка сохранения')
        }

        response.setPayloadData('subjects', doc.anket.entrance.subjects)

        return response.getJson()
    }

    @Mutation(ns + 'subject_update')
    async subjectUpdate(@Args() args, @Info() info, @AbitOrderByUser() order: any) {

        let response = new Response();

        let doc = order.getDoc();

        let inputModel = args.model

        let subdoc: any = {}

        if (inputModel._id) {
            subdoc = doc.anket.entrance.subjects.id(inputModel._id);
        } else {
            doc.anket.entrance.subjects.push({})
            subdoc = doc.anket.entrance.subjects[doc.anket.entrance.subjects.length - 1]
        }

        subdoc.set({
            subject: inputModel.subject,
            score: inputModel.score ? parseInt(inputModel.score) : 0,
            status: inputModel.status,
            year: inputModel.year ? parseInt(inputModel.year) : 0,
        })

        try {
            await order.savePromise();
            response.addSuccess('Успешно сохранено', {notify: true})
        } catch (e) {
            console.log(e)
            throw new BadRequestException('Ошибка сохранения')
        }

        response.setPayloadData('subjects', doc.anket.entrance.subjects)

        return response.getJson()
    }

    @Mutation(ns + 'apps_arrange')
    async appssArrange(
        @Args() args: any,
        @Info() info,
        @AbitOrderByUser() order: Model,
        @UserCurrent() user: UserModel
    ) {
        let result = new Response();

        try {

            const savedAppGroups = await order.getAppGroups()

            for (const inputAppGroup of args.items) {
                const savedAppGroup = savedAppGroups.find(item => item.id === inputAppGroup.id)
                if (savedAppGroup) {
                    const savedApps = await savedAppGroup.getApps()
                    for (const inputApp of inputAppGroup.apps) {
                        const savedApp = savedApps.find(item => item.id === inputApp.id)
                        if (savedApp) {
                            savedApp.priority = inputApp.priority
                            await savedApp.savePromise()
                        }
                    }
                }
            }

            result.addSuccess('Приоритет изменен', {notify: true})

        } catch (e) {
            result.addError(e.message, {notify: true})
        }

        return result.getJson()
    }


    @Mutation(ns + 'app_delete')
    async applicationDelete(
        @Args() data: any,
        @Info() info,
        @AbitOrderByUser() order: Model,
        @UserCurrent() user: UserModel
    ) {
        let result = new Response();

        try {
            const apps = await order.getAppsCollection()

            const app = apps.findById(data.id)

            if (app) {
                await this.publicService.appCancelAbit(order, app)
            }

            //await apps.save()

            result.addSuccess('Заявление успешно удалено', {notify: true})

        } catch (e) {
            result.addError(e.message, {notify: true})
        }

        return result.getJson()
    }


    @Mutation(ns + 'app_add')
    async applicationAdd(
        @Args() args: any,
        @Info() info,
        @AbitOrderByUser() order: Model,
        @UserCurrent() user: UserModel
    ) {
        let result = new Response();
        try {
            await this.coreService.addAppFromPublic(order, args.competitionId, user)
            result.addSuccess('Успешно добавлено', {notify: true})
        } catch (e) {
            result.addError(e.message, {notify: true})
        }
        return result.getJson()
    }

    @Mutation(ns + 'doc_update')
    async docUpdate(
        @Args() args: any,
        @Info() info,
        @AbitOrderByUser() order: Model,
        @UserCurrent() user: UserModel
    ) {
        let result = new Response();

        try {

            let doc: EduDocModel

            if (args.action === 'create') {
                doc = this.docService.createModel({})
                doc.orderId = order.id
            } else {
                doc = await this.docService.query().getById(args.id)
            }

            const model = args.model

            doc.createSource = AbitWorkplaceEnum.CIS_ABIT
            doc.type = model.type

            doc.docTypeId = model.docTypeId
            doc.docCategoryId = model.docCategoryId

            doc.docSeries = model.docSeries
            doc.docNumber = model.docNumber
            doc.issueDate = model.issueDate
            doc.docOrg = model.docOrg

            doc.fields = model.fields
            doc.files = model.files

            await doc.savePromise()

            if (args.action === 'create') {
                await this.fileService.temporarySetDoc('doc', args.id, doc._id.toString())
            }

            result.setPayloadData('entityId', doc._id)

            result.addSuccess('Документ сохранен')

        } catch (e) {
            console.log(e)
        }

        return result.getJson()
    }

    @Mutation(ns + 'ensure_required')
    async ensureRequired(@Args() args, @Info() info, @AbitOrderByUser() order: AbitOrderModel) {
        await order.ensureLevelRequiredTests()
        return order
    }

    @Mutation(ns + 'tests_save')
    async testsSave(@Args() args, @Info() info, @AbitOrderByUser() order: AbitOrderModel) {
        let result = new Response()

        let inputTests = args.data

        const tests = await order.getTests()

        for (const inputTest of inputTests) {

            const subject = await this.eduSubjectService.query().where({
                id: inputTest.csubject
            }).execOne()

            if (subject) {
                if (order.eduTypeSlug === 'bak') {
                    if (!subject.isEge) {
                        continue;
                    }
                } else if (order.eduTypeSlug === 'spo') {
                    if (subject.id !== 27) {
                        continue;
                    }
                }
            } else {
                continue;
            }

            if (inputTest.isNew) {
                let test = tests.find(test => test.csubject === inputTest.csubject)

                if (!test) {
                    test = this.abitTestService.createModel({})
                    test.fio = order.getFio()
                    test.snils = order.getSnils()
                    test.orderId = order.id
                    test.orderNid = order.nid
                    test.csubject = inputTest.csubject
                    test.abitEgeBall = inputTest.abitEgeBall
                    test.abitPassingType = inputTest.abitPassingType
                    test.isEge = subject.isEge
                    test.createSource = AbitWorkplaceEnum.CIS_ABIT
                    await test.savePromise()
                }
            } else {
                let test = tests.find(test => test.id === inputTest.id && (test.csubject === inputTest.csubject))
                if (test && test.canEditAbit) {
                    test.abitPassingType = inputTest.abitPassingType
                    test.abitEgeBall = parseFloat(inputTest.abitEgeBall)
                    test.abitEgeYear = inputTest.abitEgeYear
                    await test.savePromise()
                }
            }
        }

        return result.getJson()
    }
}
