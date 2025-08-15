import {Args, Info, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {FileService as ModelCoreService} from "../core/service";
import {FileAdminService as ModelAdminService} from "./service";
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../../user/core/guards/userRolesAdminGuard";

@UseGuards(UserRolesAdminGuard)
@Resolver('File')
export class FileAdminResolvers {
    constructor(
        private readonly coreService: ModelCoreService,
        private readonly adminService: ModelAdminService,
    ) {
    }

    @Query('file_admin_single')
    async single(@Args() args, @Info() info) {
        const query = this.adminService.query()
        return query
            .withViewPublic()
            .findOne()
            .exec()
    }

    @Query('file_admin_recordset')
    async recordset(@Args() args, @Info() info) {
        const query = this.adminService.query()
        return  await query
            .clientFilter(args.filter, this.coreService.model)
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .getGraph()
    }

    @Query('file_admin_list')
    async list(@Args() args, @Info() info) {
        const query = this.adminService.query()
        return query
            .clientFilter(args.filter, this.coreService.model)
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .exec()
    }

    @Query('file_admin_filters')
    async listFilters(@Args() args, @Info() info) {
        return await this.adminService.getFiltersTree()
    }

    @ResolveField()
    async actions(
        @Parent() parent,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return this.adminService.getActions(parent, user)
    }
}
