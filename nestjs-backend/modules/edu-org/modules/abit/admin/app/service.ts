import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduLevelService} from "~modules/edu-org/modules/level/core/service";
import {EduFobService} from "~modules/edu-org/modules/fob/core/service";
import {EduCampaignService} from "~modules/edu-org/modules/campaign/core/service";
import {EntityService} from "~modules/entity/entity.service";
import {EduAdminService} from "~modules/edu-org/admin/service";
import {EduAdmissionService} from "~modules/edu-org/modules/admission/core/service";
import {EduInstituteService} from "~modules/edu-org/modules/institute/core/service";
import {EduQuotaTypeService} from "~modules/edu-org/modules/quota-type/core/service";
import {AbitAppService} from "~modules/edu-org/modules/abit/core/app/service";
import {EduAchievementService} from "~modules/edu-org/modules/achievement/core/type/service";
import {UserService} from "~modules/user/core/user.service";
import {AbitOrderAdminService} from "~modules/edu-org/modules/abit/admin/order/service";
import {EduAppAdminQuery as ModelAdminQuery} from "./query";
import {EduSourceService} from "~modules/edu-org/modules/source/core/service";
import {AbitAppModel} from "~modules/edu-org/modules/abit/core/app";

@Injectable()
export class AbitAppAdminService {

    getFilters = require('./service-methods/getFilters').default

    constructor(
        @Inject(forwardRef(() => AbitOrderAdminService))
        private readonly abitOrderAdminService: AbitOrderAdminService,
        private readonly aisService: EduAisService,
        private readonly serviceEduLevel: EduLevelService,
        private readonly serviceEduFob: EduFobService,
        private readonly serviceEduCampaign: EduCampaignService,
        private readonly entityService: EntityService,
        private readonly eduAdminService: EduAdminService,
        private readonly eduAdmissionService: EduAdmissionService,
        private readonly eduInstituteService: EduInstituteService,
        private readonly eduAchievementService: EduAchievementService,
        private readonly eduQuotaType: EduQuotaTypeService,
        private readonly userService: UserService,
        private readonly coreService: AbitAppService,
        public readonly sourceService: EduSourceService,
    ) {
        this.entityService.registerEntityType('edu_app', {
            label: '',
            adminService: this
        })
    }

    modelContext(): any {
        return {
            adminService: this
        }
    }

    query() {
        return (new ModelAdminQuery(this.model.find())).addModelContext({
            ...this.coreService.modelContext(),
            ...this.modelContext(),
        })
    }

    get model() {
        return this.coreService.model
    }

    async entityAction_copy_reason_message(app: AbitAppModel) {
        const order = await app.getOrder()
        if (order && app.isCanceled && !app.cancelReasonMessage && order.state.message) {
            app.cancelReasonMessage = order.state.message
            await app.savePromise()
        }
    }
}
