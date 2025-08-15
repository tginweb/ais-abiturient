import {Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";

import {EduSheetModel as Model} from "./model"
import {EduSheetService as ModelService} from "./service"
import {AbitAppService} from "~modules/edu-org/modules/abit/core/app/service";

@Resolver('EduSheet')
export class EduSheetResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly modelService: ModelService,
        public appService: AbitAppService,
    ) {
    }
}
