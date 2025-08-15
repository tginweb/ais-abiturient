import * as DataLoader from 'dataloader'
import {Injectable} from "@nestjs/common";
import {NestDataLoader} from "~lib/interceptors/dataloader";

import {EduCompetitionService as Service} from "./service"
import {EduCompetitionModel as Model} from "./model"

@Injectable()
export class AbitOrderDataloader implements NestDataLoader<string, Model> {
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
