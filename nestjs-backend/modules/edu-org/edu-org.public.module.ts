import {Module} from '@nestjs/common';
import {EduAisModule} from "~modules/edu-ais/edu-ais.module";
import {CoreService} from "~modules/core/core.service";
import {CoreModule} from "~modules/core/core.module";
import {UserModule} from "~modules/user/core/user.module";
import {MailModule} from "~modules/mail/mail.module";
import {EntityModule} from "~modules/entity/entity.module";
import {FileModule} from "~modules/file/core/module";
import {EduPublicService} from "./public/service";
import {APP_INTERCEPTOR} from "@nestjs/core/constants";
import {DataLoaderInterceptor} from "~lib/interceptors/dataloader";

const submodules = [
    require('./modules/achievement/core/boot'),
    require('./modules/achievement/public/boot'),

    require('./modules/admission/core/boot'),
    require('./modules/admission/public/boot'),

    require('./modules/competition/core/boot'),

    require('./modules/doc/core/boot'),
    require('./modules/doc/public/boot'),

    require('./modules/epgu-dictionary/core/boot'),

    require('./modules/language/core/boot'),
    require('./modules/country/core/boot'),

    require('./modules/subject/core/boot'),
    require('./modules/subject/public/boot'),

    require('./modules/direction/core/boot'),

    require('./modules/level/core/boot'),
    require('./modules/level/public/boot'),


    require('./modules/person-doctype/core/boot'),

    require('./modules/quota-type/core/boot'),

    require('./modules/doctype/core/boot'),

    require('./modules/family-type/core/boot'),

    require('./modules/language/core/boot'),

    require('./modules/institute/core/boot'),
    require('./modules/institute/public/boot'),

    require('./modules/quota-type/core/boot'),

    require('./modules/campaign/core/boot'),

    require('./modules/volume/core/boot'),

    require('./modules/fob/core/boot'),
    require('./modules/fob/public/boot'),

    require('./modules/source/core/boot'),
    require('./modules/source/public/boot'),

    require('./modules/program/core/boot'),

    require('./modules/order-message/core/boot'),
    require('./modules/order-message/public/boot'),

    require('./modules/abit/core/boot'),
    require('./modules/abit/public/boot'),

    require('./modules/epgu-dictionary/core/boot'),
]

const meta = {
    imports: [
        UserModule,
        EduAisModule,
        CoreModule,
        EntityModule,
        FileModule,
        MailModule
    ],
    exports: [
        EduPublicService
    ],
    controllers: [],
    providers: [
        EduPublicService,
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
export class EduOrgPublicModule {
    constructor(private coreService: CoreService) {
    }

    onModuleInit() {

        submodules.forEach(submodule => {
            submodule.hooks && submodule.hooks(this.coreService.hooks, this)
        })

    }
}
