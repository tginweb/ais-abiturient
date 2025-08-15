import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {FileModel} from "./model";
import {dbResultsFormat} from "~lib/db/results";
import * as mongoose from "mongoose";
import {EntityService} from "~modules/entity/entity.service";
import * as fs from "fs";
import {FileQuery as ModelQuery} from "./query";

const path = require('path')

@Injectable()
export class FileService {

    constructor(
        @InjectModel(FileModel) public readonly model: ReturnModelType<typeof FileModel> | any,
        private readonly entityService: EntityService,
    ) {
        this.entityService.registerEntityType('file', {
            service: this,
            query: this.query.bind(this),
            model: this.model,
        })
    }


    createValidateErrors<T>(
        data: any,
    ): any {
        let fileEntity = new this.model(data);
        return fileEntity.validateSync()
    }

    async temporarySetDoc(
        relDocType: string,
        relDocIdTemp: string,
        relDocId: string,
    ) {
        const files = await this.query().where({
            temporary: true,
            relDocType: relDocType,
            relDocId: relDocIdTemp,
        }).execMany()

        for (const file of files) {
            file.temporary = false
            file.relDocId = relDocId
            await file.savePromise()
        }
    }

    async delete<T>(
        conditions: object,
    ): Promise<T[]> {
        return await this.model.deleteMany(conditions);
    }

    createModel(data: any): FileModel {
        return new this.model(data)
    }

    async publicFindOneBy<T>(
        by: string,
        value: any,
        taxonomy?: string,
        view?: string[] | string | { view: string },
    ): Promise<T[]> {
        return this.model.findOne({_id: parseInt(value)}).exec();
    }

    async findByIds<T>(
        ids: [number | string],
        view?: string[] | string | { view: string },
        by?: boolean | string
    ): Promise<T[]> {
        return dbResultsFormat(await this.model.find({_id: {$in: ids}}).withView(view).exec(), by);
    }

    async findOneBy<T>(by: string, val: any): Promise<any | T> {
        return this.model.findOne({[by]: val});
    }

    async findOneById<T>(id: any): Promise<any | T> {
        return this.findOneBy('_id', mongoose.Types.ObjectId(id));
    }

    async saveFile(content, data: any = {}) {

        const filePath = path.join(process.cwd(), 'uploads/' + data.filename)
        await fs.promises.writeFile(filePath, content)

        const model = new this.model({
            ...data,
            relDocType: 'order',
            used: true,
        })

        await model.save()

        return model
    }

    modelContext(): any {
        return {
            service: this
        }
    }

    query() {
        return (new ModelQuery(this.model.find())).addModelContext(this.modelContext())
    }
}
