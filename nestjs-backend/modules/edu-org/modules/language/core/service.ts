import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduLanguageModel as Model} from "./model";
import {EduAisService} from "~modules/edu-ais/edu-ais.service";

@Injectable()
export class EduLanguageService {

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private readonly aisService: EduAisService,
    ) {
    }

}

