import {Args, Info, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduFisMessageModel, EduFisMessageModel as Model} from "./model"
import {EduFisMessageQuery as ModelQuery} from "./query";
import {EduFisMessageService as ModelService} from "./service";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {Response} from "~lib/response";
import {EntityService} from "~modules/entity/entity.service";
import Collection from "~lib/collection";
import {forwardRef, Inject, UseGuards} from "@nestjs/common";
import chunkArray from "~lib/util/base/chunkArray";
import {UserRolesAdminGuard} from "~modules/user/core/guards/userRolesAdminGuard";

@UseGuards(UserRolesAdminGuard)
@Resolver('EduFisMessage')
export class EduFisMessageResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        @Inject(forwardRef(() => ModelService))
        private readonly service: ModelService,
        @Inject(forwardRef(() => EntityService))
        private entityService: EntityService,
    ) {
    }

    @Query('edu_fis_message_listRecordset')
    async recordset(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model), {}, args.where)
            .withViewAdmin()
            .withNavPublic(args.nav || {})
            .getGraph()
    }

    @Query('edu_fis_message_list')
    async list(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .exec()
    }

    @Query('edu_fis_message_single')
    async single(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withViewPublic()
            .findOne()
            .withFilter(generateClientFilter(args.filter, this.model))
            .exec()
    }

    @Query('edu_fis_message_listFilters')
    async filters(@Args() args, @Info() info) {
        return await this.service.getFiltersTree()
    }

    @Mutation('edu_fis_message_action')
    async action(@Args() args, @Info() info) {

        let result = new Response();

        try {
            const docs = (await this.service.query().filterIds(args).execCollection<Collection<Model>>()).checkIds(args).all()

            for (const doc of docs) {
                await this.service.entityAction(args.action, doc, args)
            }

            result.addSuccess('Обработано ' + args.action + ' ' + docs.length, {notify: true})

        } catch (e) {
            console.log(e)
        }

        return result.getJson()
    }


    @Mutation('edu_fis_message_runProcess')
    async runProcess(@Args() args, @Info() info) {

        let res = new Response();

        const docs = await this.service.find({
            'state.step': {$ne: 'done'},
            'state.processed': {$ne: true},
            'state.running': {$ne: true},
            'archive': {$ne: true},
        }, {
            limit: 3
        })

        for (const doc of docs) {
            res.counterAddResult(await this.service.entityAction_process(doc))
        }

        res.addSuccess('Обработано ' + res.counters.success, {notify: true})

        return res.getJson()
    }

    @Mutation('edu_fis_message_save')
    async save(@Args() args, @Info() info) {

        let res = new Response();

        let inputModel = args.model

        const model: EduFisMessageModel = await this.model.findOne({_id: inputModel._id})

        model.setContext(this.service.getModelContext())

        model.request.payloadXml = inputModel.request.payloadXml

        await model.getToken()

        await model.savePromise()

        res.addSuccess('Saved', {notify: true})

        return res.getJson()
    }

    @Mutation('edu_fis_message_createFromArgs')
    async createFromArgs(@Args() args, @Info() info) {

        let result = new Response();
        try {

            await this.service.createMessageFromArgs(args.messageType, args)

            result.addSuccess('Обработано', {notify: true})

        } catch (e) {
            console.log(e)
        }

        return result.getJson()
    }


    @Mutation('edu_fis_message_createFromEntity')
    async createFromEntity(@Args() args, @Info() info) {

        let result = new Response();
        try {

            const entities = await this.entityService.query(args.entityType).filterIds(args).exec()

            for (const entity of entities) {
                await this.service.createMessageFromEntity(args.messageType, args.entityType, entity)
            }

            result.addSuccess('Обработано ' + entities.length, {notify: true})

        } catch (e) {
            console.log(e)
        }

        return result.getJson()
    }

    @Mutation('edu_fis_message_createFromEntities')
    async createFromEntities(@Args() args, @Info() info) {

        let result = new Response();
        try {
            const entities = await this.entityService.query(args.entityType).filterIds(args).exec()

            if (args.split) {
                const chunks = chunkArray(entities, args.split)
                for (const chunk of chunks) {
                    await this.service.createMessageFromEntities(args.messageType, args.entityType, chunk)
                }
            } else {
                await this.service.createMessageFromEntities(args.messageType, args.entityType, entities)
            }

            result.addSuccess('Обработано ' + entities.length, {notify: true})

        } catch (e) {
            console.log(e)
        }

        return result.getJson()
    }

    @ResolveField()
    async actions(
        @Parent() entity,
        @Info() info
    ) {
        return entity && entity.id ? entity.getActions() : []
    }

    @ResolveField()
    async personFio(
        @Parent() entity,
        @Info() info
    ) {
        return entity.getPersonFio()
    }

    @ResolveField()
    async personIdent(
        @Parent() entity,
        @Info() info
    ) {
        return  entity.getPersonIdent()
    }
}

