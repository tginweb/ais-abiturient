import {Injectable} from '@nestjs/common';
import {EntityService} from "~modules/entity/entity.service";
import {FileService as CoreService} from "../core/service";

const path = require('path')

@Injectable()
export class FileAdminService {
    getFiltersTree = require('./service-methods/getFiltersTree').default
    getActions = require('./service-methods/getActions').default

    constructor(
        private readonly entityService: EntityService,
        private readonly coreService: CoreService,
    ) {

    }

    query() {
        return this.coreService.query()
    }

}
