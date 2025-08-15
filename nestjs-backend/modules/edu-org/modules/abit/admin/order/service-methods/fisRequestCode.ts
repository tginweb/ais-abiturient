import {AbitOrderAdminService} from "../service";
import {AbitOrderModel as Model} from "~modules/edu-org/modules/abit/core/order/model";
import {Subject} from "~modules/edu-org/modules/abit/core/order/subdoc/anket/entrace/subject";
import {AbitOrderAdminQuery as ModelQuery} from "~modules/edu-org/modules/abit/admin/order/query";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";

export default async function (this: AbitOrderAdminService) {

    /*
    const query = new ModelQuery(this.model.find())
    const orders: [Model] = await query
        .withFilter(generateClientFilter(args.filter, this.model))
        .withNavPublic(args.nav || {})
        .withViewPublic()
        .exec()
*/
    const orders = []

    const lines = []

    for (const order of orders) {

        const fio = [
            order.anket.personal.lastName && order.anket.personal.lastName.trim(),
            order.anket.personal.firstName && order.anket.personal.firstName.trim(),
            order.anket.personal.secondName && order.anket.personal.secondName.trim(),
        ]

        let line = [
            fio[0],
            fio[1],
            fio[2],
            order.anket.personal.doc.serial && order.anket.personal.doc.serial.trim(),
            order.anket.personal.doc.number && order.anket.personal.doc.number.trim(),
        ]

        let emptyField = false
        for (const field of line) {
            if (!field) emptyField = true
        }

        if (emptyField)
            continue

        lines.push(line)
    }

    return lines.map(line => line.join('%'))
}
