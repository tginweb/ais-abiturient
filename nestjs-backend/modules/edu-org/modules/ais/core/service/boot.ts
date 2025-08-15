import {EduAisService} from './service';

export function boot(module) {
    module.imports.push(

    )

    module.exports.push(
        EduAisService
    )

    module.providers.push(
        EduAisService,
    )
}
