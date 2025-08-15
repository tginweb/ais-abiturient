import {Args, Info, Query, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduDocModel as Model} from "../core/model"
import {EduDocPublicQuery as ModelPublicQuery} from "./query";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";

@Resolver('EduDoc')
export class EduDocPublicResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
    ) {
    }
 
    @Query('edu_doc_public_list')
    async list(@Args() args, @Info() info) {
        const query = new ModelPublicQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .exec()
    }
}
