import {Module} from '@nestjs/common';
import {EduAisModule} from "~modules/edu-ais/edu-ais.module";
import {CoreService} from "~modules/core/core.service";
import {CoreModule} from "~modules/core/core.module";
import {UserModule} from "~modules/user/core/user.module";
import {MailModule} from "~modules/mail/mail.module";
import {EntityModule} from "~modules/entity/entity.module";
import {FileModule} from "~modules/file/core/module";
import {EduAdminService} from "./admin/service";
import { APP_INTERCEPTOR } from "@nestjs/core/constants";
import { DataLoaderInterceptor } from "~lib/interceptors/dataloader";
import {EduEpguDictionaryService} from "~modules/edu-org/modules/epgu-dictionary/core";
import {DadataModule} from "~modules/dadata/module";
import {EduFisClientService} from "./modules/fis/client/service";

const submodules = [
    require('./modules/ege/core/boot'),
    require('./modules/ege/admin/boot'),

    require('./modules/ais-entrant/boot'),

    require('./modules/ss-app/core/boot'),
    require('./modules/ss-app/admin/boot'),

    require('./modules/ss-entrant/core/boot'),
    require('./modules/ss-entrant/admin/boot'),

    require('./modules/epgu-service/core/boot'),

    require('./modules/epgu-message/admin/boot'),

    require('./modules/epgu-dictionary/core/boot'),
    require('./modules/epgu-dictionary/admin/boot'),

    require('./modules/doc/core/boot'),
    require('./modules/doc/admin/boot'),

    require('./modules/volume/core/boot'),
    require('./modules/volume/admin/boot'),

    require('./modules/competition/core/boot'),
    require('./modules/competition/admin/boot'),

    require('./modules/admission/core/boot'),
    require('./modules/admission/admin/boot'),

    require('./modules/achievement/core/boot'),
    require('./modules/achievement/public/boot'),

    require('./modules/language/core/boot'),
    require('./modules/country/core/boot'),

    require('./modules/subject/core/boot'),
    require('./modules/subject/admin/boot'),

    require('./modules/direction/core/boot'),
    require('./modules/direction/admin/boot'),

    require('./modules/level/core/boot'),
    require('./modules/level/admin/boot'),

    require('./modules/person-doctype/core/boot'),

    require('./modules/quota-type/core/boot'),

    require('./modules/doctype/core/boot'),

    require('./modules/family-type/core/boot'),

    require('./modules/language/core/boot'),

    require('./modules/sheet/core/boot'),
    require('./modules/sheet/admin/boot'),

    require('./modules/rating/core/boot'),
    require('./modules/rating/admin/boot'),


    require('./modules/institute/core/boot'),
    require('./modules/institute/admin/boot'),

    require('./modules/quota-type/core/boot'),

    require('./modules/campaign/core/boot'),
    require('./modules/campaign/admin/boot'),

    require('./modules/decree/core/boot'),
    require('./modules/decree/admin/boot'),


    require('./modules/fob/core/boot'),
    require('./modules/fob/admin/boot'),

    require('./modules/source/core/boot'),
    require('./modules/source/admin/boot'),

    require('./modules/program/core/boot'),
    require('./modules/program/admin/boot'),

    require('./modules/abit/core/boot'),
    require('./modules/abit/admin/boot'),

    require('./modules/order-message/core/boot'),
    require('./modules/order-message/admin/boot'),

    require('./modules/fis/core/boot'),
    require('./modules/fis/client/boot'),

    require('./modules/ais-message/boot'),
]

const meta = {
    imports: [
        UserModule,
        EduAisModule,
        CoreModule,
        EntityModule,
        FileModule,
        MailModule,
        DadataModule
    ],
    exports: [
        EduAdminService
    ],
    controllers: [],
    providers: [
        EduAdminService,
        {
            provide: APP_INTERCEPTOR,
            useClass: DataLoaderInterceptor,
        },
    ],
}

const collector = {
    menu: []
}

submodules.forEach(submodule => {
    submodule.boot(meta, collector)
})

@Module(meta)
export class EduOrgAdminModule {
    constructor(
        private coreService: CoreService,
        private epguDictionaryService: EduEpguDictionaryService,
        private fisClientService: EduFisClientService,
    ) {
    }

    async onModuleInit() {

        this.coreService.hooks.addFilter('menu_items', 'menu', (items, itemsByCode) => {

            items.push({
                parentCode: 'admin',
                code: 'edu-org.org',
                label: 'ВУЗ',
                perms: ['admin'],
                icon: 'fasBuilding',
            })

            items.push({
                parentCode: 'admin',
                code: 'edu-epgu',
                label: 'ЕПГУ',
                icon: 'fasShareAlt',
                perms: ['admin']
            })

            items.push({
                parentCode: 'admin',
                code: 'edu-fis',
                label: 'ФИС',
                icon: 'fasShareAlt',
                perms: ['admin']
            })

            items.push({
                parentCode: 'admin',
                code: 'edu-ais',
                label: 'АИС',
                icon: 'fasShareAlt',
                perms: ['admin']
            })

            items.push({
                parentCode: 'admin',
                code: 'edu-org.admin',
                label: 'Организация',
                perms: ['admin'],
                icon: 'fasBuilding',
            })

            items.push({
                parentCode: 'edu-org.admin',
                code: 'edu-org.admin.dictionaries',
                label: 'Справочники',
                perms: ['admin'],
            })

            items.push({
                parentCode: 'admin',
                code: 'edu-org.operator',
                label: 'Оператор',
                icon: 'fasBriefcase',
                perms: ['operator'],
            })

            items.push({
                parentCode: 'admin',
                code: 'edu-org.fac',
                label: 'Факультет',
                perms: ['fac'],
                icon: 'fasGraduationCap',
            })

            Array.prototype.push.apply(items, collector.menu)

            submodules.forEach(submodule => {
                submodule.menuItems && submodule.menuItems(items)
            })

            return items
        });

        submodules.forEach(submodule => {
            submodule.hooks && submodule.hooks(this.coreService.hooks, this)

            submodule.onModuleInit && submodule.onModuleInit()
        })

        await this.epguDictionaryService.getTermsByTax('ReasonsRejectionCls')
    }

    async onApplicationBootstrap() {
        submodules.forEach(submodule => {
            submodule.onApplicationBootstrap && submodule.onApplicationBootstrap()
        })

        await this.fisClientService.registerJobs()
    }
}
