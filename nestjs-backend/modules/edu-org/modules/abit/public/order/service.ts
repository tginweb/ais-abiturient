import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {AbitOrderModel as Model} from "./../../core/order/model";
import {AbitOrderPublicQuery as ModelPublicQuery} from "./query";
import {OnEvent} from "@nestjs/event-emitter";
import {AbitAppModel} from "~modules/edu-org/modules/abit/core/app/model"
import {AbitOrderService as CoreService} from "~modules/edu-org/modules/abit/core/order/service"
import {AbitAppService} from "~modules/edu-org/modules/abit/core/app/service";
import {AppStatusEnum} from "~modules/edu-org/modules/abit/core/app/enum";
import {AbitWorkplaceEnum} from "~modules/edu-org/enum/source-workplace";

@Injectable()
export class AbitOrderPublicService {

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private readonly coreService: CoreService,
        private readonly abitAppService: AbitAppService,
    ) {

    }

    @OnEvent('user-register')
    async onUserRegister(user: any): Promise<any> {
        await this.ensureByUser(user, user.eduType, true)
    }

    @OnEvent('user-activate11')
    async onUserActivate(user: any): Promise<any> {

        /*
        const orphanOrder = await this.entityService.findOne('edu_order', {
            'anket.personal.email': user.email,
            userId: {$exists: false},
        })

        if (orphanOrder) {
            orphanOrder.userId = user._id
            await orphanOrder.savePromise()
            this.eventEmitter.emit('order_event', orphanOrder, 'connect_to_user', {
                creatorUserId: user._id,
                data: {},
                notify: true
            });
        }

        await this.ensureByUser(user, user.eduType, true)

         */
    }

    async ensureByUser<T>(user: any, eduType?: number, create: boolean = false): Promise<any> {

        let userId = user._id

        let order

        order = await (new ModelPublicQuery(this.model.findOne({
            userId: userId,
            deleted: {$ne: true}
        }))).withView().exec()


        if (!order) {

            if (create) {

                let newData = {
                    eduType: eduType,
                    userId: userId,
                    state: {
                        status: 'draft',
                    }
                }

                order = new this.model(newData)

                order.anket.personal.email = user.email
                order.anket.personal.phone = user.phone
                order.anket.personal.firstName = user.firstName
                order.anket.personal.lastName = user.lastName
                order.anket.personal.secondName = user.secondName
                order.anket.personal.snils = user.snils
                order.anket.personal.citizenship = user.citizenship

                await order.save()

                if (order._id) {
                    order = await this.coreService.query().where({ userId: userId}).execOne()
                    await this.coreService.ensureOrderInternalDocs(order)
                }

            }
        }

        if (order)
            order.addContext(this.coreService.modelContext())

        return order;
    }

    async appCancelAbit(order, app: AbitAppModel): Promise<Boolean> {

        if (app.canDelete && false) {
            await app.deletePromise()
        } else {
            console.log('CC')
            app.statusId = AppStatusEnum.CANCELED_ABIT
            app.cancelSource = AbitWorkplaceEnum.CIS_ABIT
            app.cancelAt = new Date()
            await app.savePromise()
        }

        return true
    }

    /*
    async appCreateByUser(order: AbitOrderModel, appDto: AbitAppModel, user): Promise<AbitAppModel | Boolean> {

        const apps = await order.getAppsCollection()

        const newApp = this.abitAppService.createModel(<AbitAppModel>{
            cadmission: appDto.cadmission,
            csource: appDto.csource,
            registerSource: EnumSourceWorkplace.LK,
            createUserId: user._id,
            statusCode: AbitAppStatusStage.DRAFT
        })

        const admission = await newApp.getAdmission()
        const source = await newApp.getSource()

        if (!admission || !source) {
            throw new BadRequestException('Неверный ввод')
        }

        const activeApps = apps.getActiveItems()
        const canceledApps = apps.getCanceledItems()

        if (activeApps.length >= order.eduTypeAppsLimit)
            throw new BadRequestException('Количество заявлений превышает максимальное для данного уровня образования: ' + order.eduTypeAppsLimit)

        const activeAppsFobs = activeApps.getFobsMap()

        if (activeApps.length > 0) {
            if (!activeAppsFobs[admission.cfob]) {
                throw new BadRequestException('Форма обучения подаваемого заявления не соответствует формам обучения заявлений, уже добавленных вами. Заявления можно подавать только по одной форме обучения.')
            }
        }

        if (activeApps.findSameApp(newApp)) {
            throw new BadRequestException('Заявление по данному направлению подготовки и основе обучения уже присутствует среди выбранных вами')
        } else if (canceledApps.findSameApp(newApp)) {
            throw new BadRequestException('Заявление по данному направлению подготовки и основе обучения уже присутствует среди отозованных вами. Вернитесь на экран заявлений и отмените отзыв заявления.')
        }

        newApp.priority = activeApps.getMaxPriority() + 1

        await apps.addItem(newApp)
        await apps.save()

        return true
    }

     */
}
