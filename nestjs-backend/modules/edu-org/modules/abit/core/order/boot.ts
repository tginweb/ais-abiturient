
import {TypegooseModule} from "nestjs-typegoose";

import {
    AbitOrderModel,
    AbitOrderResolvers,
    AbitOrderService,
    AbitOrderDataloader,
    AbitOrderUserResolvers,
    AbitOrderOldModel,
    AbitOrderOldService,
} from './';

export function boot(module) {

    module.imports.push(
        TypegooseModule.forFeature([
            AbitOrderModel,
            AbitOrderOldModel
        ]),
    )

    module.exports.push(
        AbitOrderService,
        AbitOrderOldService
    )

    module.providers.push(
        AbitOrderService,
        AbitOrderOldService,
        AbitOrderResolvers,
        AbitOrderUserResolvers,
        AbitOrderDataloader,
    )
}
