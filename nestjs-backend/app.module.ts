import {Module} from '@nestjs/common'
import {EventEmitterModule} from "@nestjs/event-emitter";
import {CoreModule, CoreService} from "~modules/core";
import {AuthModule} from "~modules/auth/auth.module"
import {UserAdminModule} from "~modules/user/admin/module"
import {FileAdminModule} from "~modules/file/admin/module"
import {ServiceModule} from "~modules/service/service.module"
import {EntityModule} from '~modules/entity/entity.module'
import {TermAdminModule} from '~modules/term/admin/module'
import {TaggerAdminModule} from '~modules/tagger/admin/module'
import {DadataModule} from '~modules/dadata/module'
import {ScheduleModule} from '@nestjs/schedule';
import {BullModule} from '@nestjs/bull';
import {MenuModule} from "~modules/menu/menu.module";
import {EduOrgAdminModule} from "~modules/edu-org/edu-org.admin.module";
import {EduAisModule} from "~modules/edu-ais/edu-ais.module";
import {SettingsAdminModule} from "~modules/settings/admin/module";

require('./loaders/dayjs')

@Module({
    imports: [
        ScheduleModule.forRoot(),
        BullModule.forRoot({
            redis: {
                host: 'localhost',
                port: 6379,
            },
        }),
        EventEmitterModule.forRoot(),
        require('./loaders/config').forImports(),
        require('./loaders/graphql').forImports(),
        require('./loaders/mailer').forImports(),
        require('./loaders/typegoose').forImports(),
        require('./loaders/i18n').forImports(),

        ServiceModule,
        DadataModule,
        AuthModule,

        CoreModule,
        EntityModule,
        MenuModule,

        UserAdminModule,
        FileAdminModule,
        TermAdminModule,
        TaggerAdminModule,

        EduOrgAdminModule,
        EduAisModule,

        SettingsAdminModule
    ],

})
export class AppModule {
    constructor(private coreService: CoreService) {
    }
}

