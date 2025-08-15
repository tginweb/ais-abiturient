import {Args, Info, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduOrderMessageModel as Model} from "./model"
import {EduOrderMessageQuery as ModelQuery} from "./query";
import {EduOrderMessageService as ModelService} from "./service";

@Resolver('EduOrder')
export class EduOrderWithMessageResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly service: ModelService,
    ) {
    }

    @ResolveField()
    async messages(
        @Parent() parent,
        @Info() info
    ) {
        return this.service.getMessagesByOrder(parent._id)
    }

}
