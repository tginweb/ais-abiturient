
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduCampaignModel,
    EduCampaignResolvers,
    EduCampaignService,
} from './index';

export function boot(module) {
    module.imports.push(
        TypegooseModule.forFeature([
            EduCampaignModel
        ]),
    )

    module.exports.push(
        EduCampaignService
    )

    module.providers.push(
        EduCampaignService,
        EduCampaignResolvers
    )
}
