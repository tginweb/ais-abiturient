import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduFobModel as Model} from "./model";
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduFobQuery as ModelQuery} from "./query";

@Injectable()
export class EduFobService {

    public allCache = null
    public allIndexedCache = null

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private readonly aisService: EduAisService,
    ) {
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

    modelContext(): any {
        return {
            service: this
        }
    }

    query() {
        return (new ModelQuery(this.model.find())).addModelContext(this.modelContext())
    }

    async getAllCached() {
        if (!this.allCache) {
            this.allCache = await this.query().where().exec()
        }
        return this.allCache
    }

    async getAllIndexedCached() {
        if (!this.allIndexedCache) {
            this.allIndexedCache = (await this.getAllCached()).reduce((map, item) => {
                map[item.id] = item
                return map
            }, {})
        }
        return this.allIndexedCache
    }

    public async getByIdCached(id) {

        return (await this.getAllIndexedCached())[id]
    }
}
