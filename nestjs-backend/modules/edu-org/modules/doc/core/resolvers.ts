import {Args, Info, Query, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduDocModel as Model} from "./model"
import {EduDocService} from "./service";
import {EduDocStatusList, EduDocRolesList} from "~modules/edu-org/modules/doc/core/enum";

@Resolver('EduDoc')
export class EduDocResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly service: EduDocService,
    ) {
    }


    @Query('edu_doc_roles')
    async roles(@Args() args, @Info() info) {
        return EduDocRolesList
    }

    @Query('edu_doc_statuses')
    async statuses(@Args() args, @Info() info) {
        return EduDocStatusList
    }
}
