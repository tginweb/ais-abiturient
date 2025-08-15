import {Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduSSEntrantModel as Model} from "./model"

@Resolver('EduSSEntrant')
export class EduSSEntrantResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
    ) {
    }
}
