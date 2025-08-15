import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduDecreeModel as Model} from "./model";
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduDecreeQuery as ModelQuery} from "./query";
import {EntityService} from "~modules/entity/entity.service";
import {AisDecree} from "~modules/edu-org/modules/ais/core/types";

@Injectable()
export class EduDecreeService {

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private entityService: EntityService,
        private readonly aisService: EduAisService,
    ) {
        this.entityService.registerEntityType('edu_decree', {
            label: '',
            find: this.find.bind(this),
            service: this,
            query: this.query.bind(this),
        })
    }

    query() {
        return (new ModelQuery(this.model.find())).addModelContext(this.modelContext())
    }

    modelContext(): any {
        return {
            service: this
        }
    }

    find<T>(filter: any = null, nav: any = null, view = 'default'): any {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(filter)
            .withNav(nav)
            .withView(view)
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

    async ensureAisDecree<T>(aisOrder: AisDecree): Promise<any> {

        let decree: Model = await this.model.findOne({
            aisId: aisOrder.id
        }).exec()

        if (!decree) {
            decree = this.createModel({
                aisId: aisOrder.id
            })
            await decree.savePromise()
        }

        return decree
    }

}
