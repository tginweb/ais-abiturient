import {Module} from '@nestjs/common';
import {FileAdminService} from './service';
import {FileAdminResolvers} from './resolvers'
import {FileModule} from "~modules/file/core/module";
import {CoreModule} from "~modules/core/core.module";
import {CoreService} from "~modules/core/core.service";
import {EntityModule} from "~modules/entity/entity.module";

@Module({
    imports: [
        CoreModule,
        EntityModule,
        FileModule,
    ],
    providers: [
        FileAdminService,
        FileAdminResolvers
    ],
    controllers: [

    ],
    exports: [FileAdminService],
})
export class FileAdminModule {
    constructor(private coreService: CoreService) {
    }

    onModuleInit() {

        this.coreService.hooks.addFilter('menu_items', 'menu', (items, itemsByCode) => {

            items.push({
                parentCode: 'admin',
                code: 'file.admin',
                label: 'Файлы',
                url: '/admin/file/list',
                icon: 'fasShareAlt',
                perms: ['admin', 'manager']
            })

            return items
        });

    }
}
