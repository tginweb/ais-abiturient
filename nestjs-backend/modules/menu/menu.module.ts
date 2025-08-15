import {Module} from '@nestjs/common';
import {MenuService} from './menu.service';
import {MenuItemModel} from './entity/menu-item.model';
import {MenuModel} from './entity/menu.model';
import {MenuResolvers} from './menu.resolvers'
import {TypegooseModule} from "nestjs-typegoose";
import {CoreModule} from "~modules/core/core.module";


@Module({
    imports: [
        TypegooseModule.forFeature([
            MenuItemModel,
            MenuModel
        ]),
        CoreModule
    ],
    providers: [
        MenuService,
        MenuResolvers
    ],
    exports: [MenuService],
})
export class MenuModule {
}
