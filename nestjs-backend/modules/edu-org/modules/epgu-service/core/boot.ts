import {EduEpguService} from './index';

export function boot(module) {
    module.imports.push(

    )

    module.exports.push(
        EduEpguService
    )

    module.providers.push(
        EduEpguService,
    )
}
