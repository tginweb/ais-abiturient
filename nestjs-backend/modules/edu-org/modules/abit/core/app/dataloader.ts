import * as DataLoader from 'dataloader'
import {Injectable} from "@nestjs/common";
import {NestDataLoader} from "~lib/interceptors/dataloader";

import {AbitAppService as Service} from "./service"
import {AbitAppModel as Model} from "./model"

@Injectable()
export class AbitAppDataloader implements NestDataLoader<string, Model> {
    constructor(
        private readonly service: Service
    ) {
    }

    generateDataLoader(): DataLoader<string, Model> {
        return new DataLoader<any, any>(async (keys: any) => {
            return this.service.query().where({nid: keys}).exec()
        });
    }
}
