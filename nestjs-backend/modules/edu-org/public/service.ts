import {Injectable} from '@nestjs/common';
import {EntityService} from "~modules/entity/entity.service";

@Injectable()
export class EduPublicService {

    constructor(
        private readonly entityService: EntityService,
    ) {
    }

    getContext() {
        return {
            entityService: this.entityService
        }
    }
}

