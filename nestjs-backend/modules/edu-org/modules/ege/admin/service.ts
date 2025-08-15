import {Injectable} from '@nestjs/common';
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduEgeService as ModelCoreService} from "./../core/service";
import {AbitOrderService} from "~modules/edu-org/modules/abit/core/order/service";

@Injectable()
export class EduEgeAdminService {

    constructor(
        private readonly coreService: ModelCoreService,
        private readonly aisService: EduAisService,
        private readonly orderService: AbitOrderService,
    ) {

    }

    async paketGenerate(orderIds?): Promise<string> {

        let docs = []

        const ordersFilters: any = {
            eduType: 2
        }

        if (orderIds && orderIds.length) {
            ordersFilters._id = {$in: orderIds}
        }

        const orders = await this.orderService.query().where(ordersFilters).execMany()

        for (const order of orders) {
            const orderDocs = await order.collectEgePassports()
            docs = [...docs, ...orderDocs]
        }

        const lines = {}

        for (const doc of docs) {
            const line = [doc.lastName, doc.firstName, doc.secondName, doc.serial, doc.number].join(';')
            lines[line] = 1
        }

        return Object.keys(lines).join("\n")
    }
}
