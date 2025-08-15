import {EduFisService} from './service';

export function boot(module) {
    module.imports.push(

    )

    module.exports.push(
        EduFisService
    )

    module.providers.push(
        EduFisService,
    )
}
