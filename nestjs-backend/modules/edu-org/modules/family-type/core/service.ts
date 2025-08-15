import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduFamilyTypeModel as Model} from "./model";
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduFamilyTypeQuery as ModelQuery} from "./query";

@Injectable()
export class EduFamilyTypeService {

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private readonly aisService: EduAisService,
    ) {
    }

}
