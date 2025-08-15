
import {TypegooseModule} from "nestjs-typegoose";

import {
    EduDirectionAdminService,
    EduDirectionAdminResolvers,
} from './index';

export function boot(module) {

    module.exports.push(
        EduDirectionAdminService
    )

    module.providers.push(
        EduDirectionAdminService,
        EduDirectionAdminResolvers
    )
}
