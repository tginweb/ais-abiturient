import {EduFisClientService} from './service';

export function boot(module) {
    module.imports.push(

    )

    module.exports.push(
        EduFisClientService
    )

    module.providers.push(
        EduFisClientService,
    )

}

