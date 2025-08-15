import {Args, Info, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {AbitOrderModel, AbitOrderModel as Model} from "./model"
import {AbitOrderService as Service} from "./service";
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";
import {EduDocService} from "~modules/edu-org/modules/doc/core/service";
import {EduAdmissionService} from "~modules/edu-org/modules/admission/core/service";

@Resolver('EduOrder')
export class AbitOrderResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly service: Service,
        private readonly docService: EduDocService,
        private readonly admissionService: EduAdmissionService,
    ) {
    }

    @ResolveField()
    async app(
        @Parent() parent,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return null
    }

    @ResolveField()
    async apps(
        @Parent() parent: AbitOrderModel,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return parent.getApps ? parent.getApps() : parent.apps
    }

    @ResolveField()
    files(
        @Parent() parent,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        const res = []

        return []

        const rowsMap = parent.files['reduce']((map, file) => {

            if (file.relDocPath) {
                const uid = file.relDocId + '.' + file.relDocPath
                if (!map[uid]) {
                    map[uid] = {
                        file: file,
                        children: []
                    }
                }
                map[uid].children.push(file)
            } else {
                map[file._id] = {
                    file: file,
                    children: []
                }
            }

            return map
        }, {})

        const rows = Object.keys(rowsMap).sort().map(key => rowsMap[key])

        rows.forEach((item: any) => {

            if (item.children.length > 1) {

                const groupId = 'g' + item.file._id

                res.push({
                    _id: groupId,
                    ...item.file.getCloneFields(),
                    children: item.children
                })

                item.children.forEach((file) => {
                    res.push(file.setDepth(1).setParentId(groupId))
                })

            } else {
                res.push(item.file)
            }
        })

        return res
    }


    @ResolveField()
    async tests(
        @Parent() parent: AbitOrderModel,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return parent.getTests ? await parent.getTests() : parent.tests
    }

    @ResolveField()
    async docs(
        @Parent() parent: AbitOrderModel,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return parent.getDocs ? await parent.getDocs() : parent.docs
    }

    @ResolveField()
    async appGroups(
        @Parent() parent: AbitOrderModel,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return parent.getAppGroups ? await parent.getAppGroups() : parent.appGroups
    }

    @ResolveField()
    async stepsInfo(
        @Parent() parent: AbitOrderModel,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return parent.getStepsFetched ? (await parent.getStepsFetched()).filter((step) => step.enable) : null
    }

    @ResolveField()
    async lastDoneStep(
        @Parent() parent: AbitOrderModel,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return parent.getLastDoneStep ? parent.getLastDoneStep() : null
    }

    @ResolveField()
    async achievements(
        @Parent() parent: AbitOrderModel,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return parent.getAchievements ? await parent.getAchievements() : parent.achievements
    }


    @Query('edu_order_availableAdmissions')
    async availableAdmissions(@Args() args, @Info() info) {
        let order = await this.service.query().filterIds(args).execOne()
        return await this.admissionService.query().where({clevel: {$in: order.eduLevels}}).withViewPublic().exec()
    }

    @ResolveField()
    async ege(
        @Parent() parent: AbitOrderModel,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return parent.getAppGroups ? await parent.getAppGroups() : parent.appGroups
    }

    @ResolveField()
    async czakaz(
        @Parent() parent: AbitOrderModel,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return parent.ais.state['czakaz']
    }

}



