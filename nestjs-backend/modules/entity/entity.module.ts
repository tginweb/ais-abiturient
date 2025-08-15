import {EntityService} from './entity.service';

import {Module} from '@nestjs/common';

import {EntityController} from './entity.controller';

@Module({
    imports: [],
    exports: [
        EntityService,
    ],
    controllers: [
        EntityController,
    ],
    providers: [
        EntityService,
    ],
})
export class EntityModule {
}
