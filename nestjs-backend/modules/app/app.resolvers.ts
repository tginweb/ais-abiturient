import {Args, Query, Resolver} from '@nestjs/graphql';
import {CoreService} from "~modules/core/core.service";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../user/core/guards/userRolesAdminGuard";


@Resolver('App')
export class AppResolvers {

    constructor(
        private coreService: CoreService
    ) {
    }

}
