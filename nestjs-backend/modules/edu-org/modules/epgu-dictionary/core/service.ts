import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduEpguDictionaryModel as Model} from "./model";
import {EduEpguDictionaryQuery as ModelQuery} from "./query";
import dictionaryTypes from "./taxonomy-types";

@Injectable()
export class EduEpguDictionaryService {

    termsByTaxCache = {}

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
    ) {


    }

    async getTermsByTax(taxId: string): Promise<Model[]> {
        if (!this.termsByTaxCache[taxId]) {
            this.termsByTaxCache[taxId] = await this.model.find({taxonomy: taxId})
        }
        return this.termsByTaxCache[taxId]
    }

    async getTermsByTaxIndexed(taxId: string): Promise<Record<string, Model>> {
        const terms = await this.getTermsByTax(taxId)
        return terms.reduce((map, term) => {
            map[term.id] = term
            return map
        }, {})
    }

    find<T>(filter: any = null, nav: any = null, view = 'default'): any {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(filter)
            .withNav(nav)
            .withView(view)
            .exec()
    }

    async findOne<T>(filter: any = null, nav: any = null, view = 'default'): Promise<any> {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(filter)
            .withNav(nav)
            .withView(view)
            .findOne()
            .exec()
    }

    async findOneBy<T>(by: string, val: any, view = 'default'): Promise<any> {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter({[by]: val})
            .withView(view)
            .findOne()
            .exec()
    }

    createModel<T>(data: any): Model {
        return new this.model(data)
    }

    getDictionaryTypesByCode() {
        return dictionaryTypes
    }

    async getTermIdByAis(tax, aisId): Promise<any> {
        const doc = await this.model.findOne({
            aisId: aisId,
            taxonomy: tax
        })
        if (doc) return doc.id
    }

    async getTermIdByName(tax, name): Promise<any> {
        const doc = await this.model.findOne({
            name: name,
            taxonomy: tax
        })
        if (doc) return doc.id
    }

    async getTermIdByOkso(okso): Promise<any> {
        const doc = await this.findOne({
            'fields.Code': {
                $in: [
                    '1.' + okso,
                    '2.' + okso,
                    '3.' + okso,
                    '4.' + okso,
                    '5.' + okso,
                    '6.' + okso,
                    '7.' + okso,
                    '8.' + okso,
                    '9.' + okso,
                    '10.' + okso,
                ]
            },
            taxonomy: 'Direction'
        })

        if (doc) return doc.id
    }


    async entityAction_update(entity: Model, {model}) {
        entity.aisId = parseInt(model.aisId)
        await entity.savePromise()
    }

    async entityAction_delete(entity: Model, params = {}) {
        return this.model.deleteOne({_id: entity._id})
    }
}
