import {
    AbitOrderPublicResolvers,
    AbitOrderPublicService,
    AbitOrderPublicController,
} from './';

export function boot(module, context) {

    module.exports.push(
        AbitOrderPublicService
    )

    module.controllers.push(
        AbitOrderPublicController
    )

    module.providers.push(
        AbitOrderPublicResolvers,
        AbitOrderPublicService,
    )
}
