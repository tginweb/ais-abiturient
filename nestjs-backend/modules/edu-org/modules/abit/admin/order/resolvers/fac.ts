import {Args, Info, Mutation, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {Response} from "~lib/response";
import {ReturnModelType} from "@typegoose/typegoose";

import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";

import {AbitOrderModel as Model} from "../../../core/order/model"
import {AbitOrderService as ModelCoreService} from "../../../core/order/service"
import {AbitOrderAdminService as ModelAdminService} from "../service";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../../../../../../user/core/guards/userRolesAdminGuard";

@UseGuards(UserRolesAdminGuard)
@Resolver('EduOrder')
export class AbitOrderAdminFacResolvers {

    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly adminService: ModelAdminService,
    ) {
    }

    @Mutation('edu_order_admin__doc_set_main')
    async docSetMain(@Args() args: any, @Info() info, @UserCurrent() user: UserModel) {

        let response = new Response();

        try {
            let order = await this.coreService.query().getByIdOrNid(args.id)

            const docs = await order.getDocs()

            for (const doc of docs) {
                if (doc.type !== args.role)
                    continue;
                doc.isMain = doc.id === args.docId
                await doc.savePromise()
            }

            await order.processMainDocs()
            await order.savePromise()

            response.addSuccess('Главный документ изменен', {notify: true})
        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }

    @Mutation('edu_order_admin__docs_save')
    async docsSave(@Args() args: any, @Info() info, @UserCurrent() user: UserModel) {

        let response = new Response();

        try {
            let order = await this.coreService.query().getByIdOrNid(args.id)

            await this.adminService.updateDocs(order, args.data)
            response.addSuccess('Заявления сохранены', {notify: true})
        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }

    @Mutation('edu_order_admin_appsSave')
    async appsSave(@Args() args: any, @Info() info, @UserCurrent() user: UserModel) {

        let response = new Response();

        try {
            let order = await this.coreService.query().getByIdOrNid(args.id)
            await this.adminService.updateApps(order, args.data)
            response.addSuccess('Заявления сохранены', {notify: true})
        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }

    @Mutation('edu_order_admin_achievementsSave')
    async achievementsSave(@Args() args: any, @Info() info, @UserCurrent() user: UserModel) {

        let response = new Response();

        try {
            let order = await this.coreService.query().getByIdOrNid(args.id)
            await this.adminService.updateAchievements(order, args.data)
            response.addSuccess('Достижения сохранены', {notify: true})
        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }

    @Mutation('edu_order_admin_achievementDelete')
    async achievementDelete(@Args() args: any, @Info() info, @UserCurrent() user: UserModel) {

        let response = new Response();

        try {
            let order = await this.coreService.query().getByIdOrNid(args.id)
            order.anket.entrance.achievements['pull']({_id: args.achievementId})
            await order.savePromise()
            response.addSuccess('Достижения сохранены', {notify: true})
        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }

    @Mutation('edu_order_admin_testsSave')
    async testsSave(@Args() args: any, @Info() info, @UserCurrent() user: UserModel) {

        let response = new Response();

        try {
            let order = await this.coreService.query().getByIdOrNid(args.id)
            await this.adminService.updateTests(order, args.data)
            response.addSuccess('Испытания сохранены', {notify: true})
        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }

    @Mutation('edu_order_admin_appAdd')
    async appAdd(@Args() args: any, @Info() info, @UserCurrent() user: UserModel) {

        let response = new Response();
        let order = await this.coreService.query().getById(args.id)

        try {
            await this.coreService.addAppFromAdmin(
                order,
                args.competitionId,
                user
            )
            response.addSuccess('Заявление добавлено', {notify: true})
        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }

    @Mutation('edu_order_admin__set_fac_first')
    async setFacFirst(@Args() args: any, @Info() info) {
        let response = new Response();

        try {
            const doc = await this.coreService.query().getById(args.id)

            if (doc) {

                const regnum = await this.coreService.setOrderInstitute(doc)

                if (regnum) {
                    await doc.savePromise()
                    response.setPayloadData('regnum', regnum)
                    response.addSuccess('Дело передано на факультет', {notify: true})
                } else {
                    response.addWarning('Дело уже на факультете', {notify: true})
                }
            }
        } catch (e) {
            response.addError(e.message, {notify: true})
        }
        return response.getJson()
    }
}
