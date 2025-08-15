import {Args, Info, Query, Resolver} from '@nestjs/graphql';
import {MenuService} from './menu.service';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {MenuItemModel} from './entity/menu-item.model';
import {MenuModel} from './entity/menu.model';
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../user/core/guards/userRolesAdminGuard";

@UseGuards(UserRolesAdminGuard)
@Resolver('Menu')
export class MenuResolvers {
    constructor(
        private readonly service: MenuService,
        @InjectModel(MenuItemModel) public readonly menuItemModel: ReturnModelType<typeof MenuItemModel>,
        @InjectModel(MenuModel) public readonly menuModel: ReturnModelType<typeof MenuModel>,
    ) {
    }

    @Query()
    async menu_app_scope(
        @Args() args,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return this.service.getMenusTree(user && user.roles || [])
    }
}

