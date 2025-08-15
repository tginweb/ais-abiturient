import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {AbitOrderTypeModel as Model} from "./model";
import {AbitOrderTypeQuery as ModelQuery} from './query'

@Injectable()
export class AbitOrderTypeService {

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
    ) {

    }

    async find<T>(filter: any = null, nav: any = null, view = 'public'): Promise<Model[]> {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(filter)
            .withNav(nav)
            .withView(view)
            .exec()
    }
}
