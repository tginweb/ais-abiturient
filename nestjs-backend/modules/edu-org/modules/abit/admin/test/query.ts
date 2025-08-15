import {AbitTestQuery} from "~modules/edu-org/modules/abit/core/test/query";
import * as mongoose from "mongoose";

export class AbitTestAdminQuery extends AbitTestQuery {

    withViewAdmin() {
        this.query.populate({
            path: 'subject',
        })
        this.query.populate({
            path: 'order',
            populate: ['institute']
        })
        this.query.populate({
            path: 'firstApp.fac',
        })
        return this
    }

    filtersSchema() {
        return {
            orderExists: async (result, cond) => {
                if (cond.eq === true) {

                    const orders = await this.context.orderService.model.find({}, ['_id'])
                    const orderIds = orders.map(order => mongoose.Types.ObjectId(order._id))

                    result.$and.push({
                        orderId: {$in: orderIds}
                    })

                } else if (cond.eq === false) {
                    const orders = await this.context.orderService.model.find({}, ['_id'])
                    const orderIds = orders.map(order => mongoose.Types.ObjectId(order._id))

                    result.$and.push({
                        orderId: {$nin: orderIds}
                    })
                }
            },
            resultExists: async (result, cond) => {
                if (cond.eq === 'any') {
                    result.$and.push({
                        $or: [
                            {abitEgeBall: {$gt: 0}},
                            {resultBall: {$gt: 0}}
                        ]
                    })
                } else if (cond.eq === 'abit') {
                    result.$and.push({
                        abitEgeBall: {$gt: 0}
                    })
                } else if (cond.eq === 'real') {
                    result.$and.push({
                        resultBall: {$gt: 0}
                    })
                } else if (cond.eq === 'no') {
                    result.$and.push({
                        $or: [
                            {resultBall: {$eq: 0}},
                            {resultBall: {$eq: null}}
                        ]
                    })
                }
            },

            cinstitute: async (result, cond) => {
                if (cond.in && cond.in.length) {

                    const orders = await this.context.orderService.model.find({
                        cinstitute: {$in: cond.in}
                    }, ['_id'])

                    const orderIds = orders.map(order => mongoose.Types.ObjectId(order._id))

                    result.$and.push({
                        orderId: {$in: orderIds}
                    })
                }
            },

            cinstituteFirstApp: async (result, cond) => {
                if (cond.in && cond.in.length) {

                    const orders = await this.context.orderService.model.find({
                        'firstApp.cfac': {$in: cond.in}
                    }, ['_id'])

                    const orderIds = orders.map(order => mongoose.Types.ObjectId(order._id))

                    result.$and.push({
                        orderId: {$in: orderIds}
                    })
                }
            },
        }
    }
}



