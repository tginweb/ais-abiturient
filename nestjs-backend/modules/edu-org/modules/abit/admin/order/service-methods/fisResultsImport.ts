import {AbitOrderAdminService} from "../service";
import {AbitOrderModel as Model} from "~modules/edu-org/modules/abit/core/order/model";
import {Subject} from "~modules/edu-org/modules/abit/core/order/subdoc/anket/entrace/subject";

export default async function (this: AbitOrderAdminService, lines) {

    const subjects = await this.eduSubjectService.find({})

    const subjectsByName = subjects.reduce((map, o) => (map[o.name.toLowerCase()] = o, map), {})

    for (const line of lines) {

        const fields = line.split(/\%/)

        let [
            lastName,
            firstName,
            secondName,
            docSerial,
            docNumber,
            subject,
            mark,
            year,
            region,
            status
        ] = [
            fields[0],
            fields[1],
            fields[2],
            fields[3],
            fields[4],
            fields[5],
            parseInt(fields[6]),
            parseInt(fields[7]),
            parseInt(fields[8]),
            fields[9],
        ]

        if (status !== 'Действующий' || !subject || !mark || !docSerial || !docNumber) {
            continue
        }

        subject = subject.toLowerCase()

        if (subject === 'информатика и икт') {
            subject = 'информатика'
        }

        if (subject === 'сочинение' || subject === 'география')
            continue

        const subjectDoc = subjectsByName[subject]

        if (!subjectDoc || subjectDoc.isege !== 't') {
            continue
        }

        let orders: [Model]

        orders = await this.query().where({
            'anket.personal.lastName': {$regex: new RegExp(lastName, "i")},
            'anket.personal.firstName': {$regex: new RegExp(firstName, "i")},
            'anket.personal.secondName': {$regex: new RegExp(secondName, "i")},
            'anket.personal.doc.serial': docSerial,
            'anket.personal.doc.number': docNumber,
        }).exec()

        if (!orders.length) {
            orders = await this.query().where({
                'anket.personal.lastName': {$regex: new RegExp(lastName, "i")},
                'anket.personal.firstName': {$regex: new RegExp(firstName, "i")},
                'anket.personal.secondName': {$regex: new RegExp(secondName, "i")},
                'anket.personal.docEge.serial': docSerial,
                'anket.personal.docEge.number': docNumber,
            }).exec()
        }

        if (!orders.length) {
            console.log('not found order ' + line)
            continue
        }

        for (const order of orders) {

            let orderSubject = order.anket.entrance.subjects.find(item => item.subject === subjectDoc.id && item.year === year)

            if (!orderSubject) {
                orderSubject = <Subject>{
                    subject: subjectDoc.id
                }
            } else {
                if (orderSubject.year === year && orderSubject.score === mark && orderSubject.checked === true) {
                    continue
                }
            }

            orderSubject.score = mark
            orderSubject.status = 'ready'
            orderSubject.year = year
            orderSubject.checked = true

            if (!orderSubject._id) {
                order.anket.entrance.subjects.push(orderSubject)
            }

            await order.savePromise()
        }
    }

}
