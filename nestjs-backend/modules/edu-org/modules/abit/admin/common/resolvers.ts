import {Args, Info, Query, Resolver} from '@nestjs/graphql';
import {UserService} from "~modules/user/core/user.service";
import sleep from "~lib/util/base/sleep";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "~modules/user/core/guards/userRolesAdminGuard";

@UseGuards(UserRolesAdminGuard)
@Resolver('AbitAdmin')
export class AbitAdminResolvers {
    constructor(
        private readonly userService: UserService,
    ) {
    }

    @Query('abit_admin_operatorsList')
    async operatorsList(@Args() args, @Info() info) {
        return this.userService.find({roles: 'operator'})
    }
}
