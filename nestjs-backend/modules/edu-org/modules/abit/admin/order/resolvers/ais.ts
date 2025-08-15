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
import {UserRolesAdminGuard} from "~modules/user/core/guards/userRolesAdminGuard";

@UseGuards(UserRolesAdminGuard)
@Resolver('EduOrder')
export class AbitOrderAdminAisResolvers {

    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly adminService: ModelAdminService,
    ) {
    }

    @Mutation('edu_order_admin_ais_update_entrants')
    async aisUpdateEntrants(
        @Args() args: any,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        let response = new Response();

        try {
            const data: any = args.dataJson ? JSON.parse(args.dataJson) : args.data

            let students

            if (data.students) {
                students = Object.values(data.students)
            } else if (Array.isArray(data)) {
                students = data
            } else if (typeof data === 'object') {
                students = [data]
            }



            response.addSuccess('Заявление обновлены', {notify: true})

        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }

}
