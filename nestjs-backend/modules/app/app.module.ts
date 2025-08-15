import {Module} from '@nestjs/common';
import {AppService} from './app.service';
import {AppResolvers} from "./app.resolvers";
import {CoreService} from "~modules/core/core.service";

@Module({
    providers: [
        AppService,
        AppResolvers
    ],
    exports: [
        AppService,
    ],
})
export class AppModule {
    constructor(private coreService: CoreService) {
    }

    onModuleInit() {

        this.coreService.hooks.addFilter('menu_items', 'menu', (items, itemsByCode) => {

            items.push({
                code: 'admin',
                url: '/admin',
            })

            items.push({
                code: 'pub',
                url: '/',
            })

            return items
        });

    }
}
