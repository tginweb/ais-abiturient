import {Args, Info, Mutation, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {Response} from "~lib/response";
import {ReturnModelType} from "@typegoose/typegoose";
import {BadRequestException, UseGuards} from "@nestjs/common";
import {EventEmitter2} from "@nestjs/event-emitter";


import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";

import {AbitOrderModel as Model} from "../../../core/order/model"
import {AbitOrderService as ModelCoreService} from "../../../core/order/service"
import {AbitOrderAdminService as ModelAdminService} from "../service";
import {AbitWorkplaceEnum} from "~modules/edu-org/enum/source-workplace";
import {AbitOrderStatusEnum} from "~modules/edu-org/modules/abit/core/order/statics/status";
import {UserRolesAdminGuard} from "../../../../../../user/core/guards/userRolesAdminGuard";

@UseGuards(UserRolesAdminGuard)
@Resolver('EduOrder')
export class AbitOrderAdminOperatorResolvers {

    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly adminService: ModelAdminService,
        private readonly eventEmitter: EventEmitter2,
    ) {
    }

    @Mutation('edu_order_admin_setStatus')
    async setStatus(@Args() args: any, @Info() info, @UserCurrent() user: UserModel) {

        let response = new Response();

        try {
            const order = await this.coreService.query().withViewAdmin().getById(args._id)

            const newStatus: AbitOrderStatusEnum = args.status

            switch (newStatus) {
                case AbitOrderStatusEnum.CANDIDATE:
                    args.notify = false
                    break;
                case AbitOrderStatusEnum.ACCEPTED:
                    break;
                default:
                    args.setInstitute = false
            }

            order.setStatus({
                status: newStatus,
                message: args.message,
            })

            if (args.setInstitute) {
                await this.coreService.setOrderInstitute(order, null, true, true)
                response.addSuccess('Заявление передано на факультет', {notify: true})
            }

            await order.savePromise()
            response.addSuccess('Статус успешно изменен', {notify: true})

            this.eventEmitter.emit('order_event', order, 'status_change', {
                creatorUserId: user._id,
                data: args,
                notify: !!args.notify
            });

        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }

    @Mutation('edu_order_admin_operatorTake')
    async operatorTake(@Args() args: any, @Info() info, @UserCurrent() user: UserModel) {

        let response = new Response();

        try {

            let order = await this.coreService.query().getById(args._id)

            if (order.coperator) {
                throw new BadRequestException('Заявка уже взята в работу другим оператором');
            }

            order.coperator = user.id

            await order.savePromise()

            response.addSuccess('Заявка взята вами в работу', {notify: true})

        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }

    @Mutation('edu_order_admin_add')
    async adminAdd(
        @Args() args: any,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {

        let response = new Response();

        try {

            let order = await this.coreService.findDuplicate(args)

            if (order) {
                response.setPayloadData('foundOrderId', order.id)
                throw new BadRequestException('Заявление уже существует')
            }

            order = this.coreService.createModel({})

            order.coperator = user.id
            order.eduType = args.eduType
            order.anket.personal.snils = args.snils
            order.anket.personal.doc.serial = args.passportSerial
            order.anket.personal.doc.number = args.passportNumber
            order.cordersource = AbitWorkplaceEnum.CIS_ADMIN
            order.state.status = AbitOrderStatusEnum.CANDIDATE

            await order.savePromise()

            response.setPayloadData('orderId', order.id)

            response.addSuccess('Заявление создано', {notify: true})

        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }
}
