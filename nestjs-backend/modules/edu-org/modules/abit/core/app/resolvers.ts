import {Args, Info, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {AbitAppModel as Model} from "./model"
import {AbitAppService} from "./service";
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";
import {appStatusList, appStatusListById} from "~modules/edu-org/modules/abit/core/app/enum";
import {EduEpguDictionaryService} from "~modules/edu-org/modules/epgu-dictionary/core";

@Resolver('EduApp')
export class AbitAppResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly service: AbitAppService,
        private readonly epguDictionaryService: EduEpguDictionaryService,
    ) {
    }

    @Query('edu_app_statusList')
    async statusList(
        @Args() args,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return appStatusList
    }

    @ResolveField()
    async availableStatusList(
        @Parent() parent: Model,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        let list = appStatusListById[parent.statusId].availableStatuses

        if (!user.isAdmin) {
            //list = list.filter(item => [11].indexOf(item)>-1)
        }

        return list
    }

    @ResolveField()
    async competition(
        @Parent() parent: Model,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return parent.getCompetition ? await parent.getCompetition() : parent.competition
    }

    @ResolveField()
    async order(
        @Parent() parent: Model,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return parent.getOrder()
    }

    @ResolveField()
    async cancelReasonTitle(
        @Parent() parent: Model,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return await parent.cancelReasonTitle()
    }
}



