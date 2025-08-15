import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduDocModel, EduDocModel as Model} from "./model";
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduDocQuery as ModelQuery} from "./query";
import {EduEpguDictionaryService} from "~modules/edu-org/modules/epgu-dictionary/core/service";
import {EntityService} from "~modules/entity/entity.service";
import * as fs from "fs";
import {FileService} from "~modules/file/core/service";
import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";
import {EduDocStatusEnum} from "~modules/edu-org/modules/doc/core/enum";
import {AbitWorkplaceEnum} from "~modules/edu-org/enum/source-workplace";
const mime = require('mime')
const AdmZip = require("adm-zip");
const path = require('path');

@Injectable()
export class EduDocService {

    public allCache = null
    public allIndexedCache = null

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private entityService: EntityService,
        private readonly aisService: EduAisService,
        private readonly epguDictionaryService: EduEpguDictionaryService,
        private readonly fileService: FileService
    ) {
        this.entityService.registerEntityType('edu_doc', {
            find: this.find.bind(this),
            findOne: this.findOne.bind(this),
            query: this.query.bind(this),
        })
    }

    find<T>(filter: any = null, nav: any = null, view = 'default'): any {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(filter)
            .withNav(nav)
            .withView(view)
            .exec()
    }

    findOne<T>(filter: any = null, nav: any = null, view = 'public'): Promise<Model> {
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

    createModel(data: any): Model {
        return new this.model(data)
    }

    createForOrderByAbit(order: AbitOrderModel, data: any): Model {
        const model = this.createModel({})
        model.type = data.type
        model.orderId = order.id
        model.isMain = !!data.isMain
        model.statusId = EduDocStatusEnum.NEW
        model.createSource = AbitWorkplaceEnum.CIS_ABIT
        model.docTypeId = data.docTypeId
        model.docCategoryId = data.docCategoryId
        model.docName = data.docName
        model.achievementTypeId = data.achievementTypeId
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

    async getInfoByTypeId(typeId) {

        let rootDocCat, docCat

        const docType = await this.epguDictionaryService.findOne({
            taxonomy: 'DocumentTypeCls',
            id: typeId
        })

        if (docType) {

            if (docType.fields.IdCategory) {

                const docCatId = docType.fields.IdCategory

                docCat = await this.epguDictionaryService.findOne({
                    taxonomy: 'DocumentCategoryCls',
                    id: docCatId
                })

                if (docCat) {
                    if (docCat.fields.IdParent) {
                        rootDocCat = await this.epguDictionaryService.findOne({
                            taxonomy: 'DocumentCategoryCls',
                            id: docCat.fields.IdParent
                        })
                    } else {
                        rootDocCat = docCat
                    }
                }
            }
        }

        return {
            rootDocCat,
            docCat
        }
    }

    async getDocCategoryIdByDocType(typeId) {
        const cat = await this.getDocCategoryByDocType(typeId)
        if (cat) {
            return cat.id
        }
    }

    async getDocCategoryByDocType(typeId) {

        const docType = await this.epguDictionaryService.findOne({
            taxonomy: 'DocumentTypeCls',
            id: typeId
        })

        if (docType) {
            if (docType.fields.IdCategory) {
                const docCatId = docType.fields.IdCategory
                return await this.epguDictionaryService.findOne({
                    taxonomy: 'DocumentCategoryCls',
                    id: docCatId
                })
            }
        }
    }

    async updateDocFromEpgu(epguDoc: any, docId) {

        let doc: EduDocModel

        if (docId) {
            doc = await this.query().getById(docId)
        } else {
            doc = await this.query().where({'epgu.guid': epguDoc.Guid}).execOne()
        }

        if (doc) {
            if (epguDoc.File)
                doc.epgu.fui = epguDoc.File.Fui

            await doc.savePromise()
        }


    }

    async createFileFromEpgu(doc: EduDocModel, epguFile: any) {

        if (!epguFile.content)
            return;

        const docId = doc.id


        if (epguFile.ext === 'zip') {
            const zipFileName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('') + '.' + epguFile.ext
            const zipFilePath = path.join(process.cwd(), '/uploads/' + zipFileName)
            await fs.promises.writeFile(zipFilePath, epguFile.content)

            const files = []
            const zip = new AdmZip(zipFilePath);
            const zipEntries = zip.getEntries();

            for (const zipEntry of zipEntries) {

                const zipFilename = zipEntry.name

                const fileBasename = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
                const fileExt = path.extname(zipFilename)
                const fileName = fileBasename + '.' + fileExt

                const filePath = path.join(process.cwd(), '/uploads/' + fileName)
                await fs.promises.writeFile(filePath, zipEntry.getData())

                const mimeType = mime.lookup(filePath)

                let fileData = {
                    temporary: false,
                    relDocType: 'doc',
                    relDocId: docId,
                    mimetype: mimeType,
                    originalname: zipFilename,
                    filesize: 0,
                    filename: fileName,
                }

                const file = this.fileService.createModel(fileData)
                await file.savePromise()
                files.push(file)
            }

            doc.files = files.map(file => file._id)
        } else {

            const fileBasename = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
            const fileExt = epguFile.ext
            const fileName = fileBasename + '.' + fileExt

            const filePath = path.join(process.cwd(), '/uploads/' + fileName)
            await fs.promises.writeFile(filePath, epguFile.content)

            const mimeType = mime.lookup(filePath)

            let fileData = {
                temporary: false,
                relDocType: 'doc',
                relDocId: docId,
                mimetype: mimeType,
                originalname: fileName,
                filesize: epguFile.content.length,
                filename: fileName,
            }

            const file = this.fileService.createModel(fileData)
            await file.savePromise()
            doc.files = [file.id]
        }

        await doc.savePromise()
    }
}
