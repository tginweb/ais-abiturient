import {AbitAdminResolvers} from './index';

export function boot(module, context) {
    module.providers.push(
        AbitAdminResolvers
    )
}

