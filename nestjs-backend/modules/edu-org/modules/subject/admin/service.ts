import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduAisService} from "~modules/edu-ais/edu-ais.service";

import {EduSubjectModel as Model} from "./../core/model";
import {EduSubjectService as ModelCoreService} from "./../core/service";

@Injectable()
export class EduSubjectAdminService {

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private readonly modelCoreService: ModelCoreService,
        private readonly aisService: EduAisService,
    ) {
    }

    async syncWithAis(): Promise<any> {

        const rep = this.aisService.getRepository()

        const aisRows = await rep.selectAllFrom('cl$subject')

        for (let i = 0; i < aisRows.length; i++) {
            const aisRow = aisRows[i]
            const localRow = await this.modelCoreService.findOne({id: aisRow.id})
            let row

            if (localRow) {
                localRow.fisid = aisRow.fisid
                await localRow.savePromise()
            }

            continue;

            if (!localRow) {
                row = this.modelCoreService.createModel({})
                row.id = aisRow.id
            } else {
                row = localRow
            }

            row.name = aisRow.name
            row.isege = aisRow.isege
            row.alternative = aisRow.alternative
            row.fisid = aisRow.fisid

            row.save()
        }
    }

    async entityAction(action, entity: Model, args) {
        //this.entityService.entityAddContext(entity)
        return this['entityAction_' + action](entity, args)
    }

    async entityAction_update(entity: Model, {model}) {

        console.log(model)

        if (model.locations)
            entity.locations = model.locations

        if (model.epguId)
            entity.epguId = parseInt(model.epguId)

        await entity.savePromise()
    }

    async entityAction_delete(entity: Model, params = {}) {
        return this.model.deleteOne({_id: entity._id})
    }
}
