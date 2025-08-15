import {BaseModel} from '~lib/db/typegoose/base.model'
import {EpguEntityState} from "~modules/edu-org/modules/epgu/core/model/epgu-entity-state";
import {prop} from "@typegoose/typegoose";

const xml2js = require('xml2js');

export class EduEntityModel extends BaseModel {

    @prop({_id: false, default: {}})
    public epguState: EpguEntityState

    async jsonToXml(data) {

        const builder = new xml2js.Builder();

        let result = builder.buildObject(data);

        result = result.replace(/\<\?xml.+?\?\>/gi, '')

        return result
    }

    async epguDocActionSync(taskId, epguEntityType, doc, path?) {
        await this.epguDocAction(taskId, epguEntityType, 'Edit', doc, path)
        await this.epguDocAction(taskId, epguEntityType, 'Add', doc, path)
    }

    async epguDocAction(taskId, messageType, messageAction, entityAction?, doc?, path?) {

        if (messageAction === 'sync')
            messageAction = 'Sync'

        if (messageAction === 'Sync') {
            await this.epguDocAction(taskId, messageType, 'Add', entityAction, doc, path)
        } else {
            const suggestions = [
                'epguPacket_' + messageType + '_' + messageAction
            ]
            if (messageAction === 'Add' || messageAction === 'Edit')
                suggestions.push('epguPacket_' + messageType + '_Sync')

            for (const suggestion of suggestions) {

                if (this[suggestion]) {

                    const data = await this[suggestion](doc)

                    await this.epguMessageCreate(taskId, messageType, messageAction, entityAction, data, doc)

                    break
                }
            }
        }
    }

    async epguMessageCreate(taskId, messageType, messageAction, entityAction, payloadData, doc) {

        const header = {
            entityType: messageType,
            action: messageAction
        }

        const message = await this.context.epguMessageService.createMessageFromEntity(
            taskId,
            header,
            payloadData,
            doc.getSubdocPathId(),
            entityAction
        )

        await this.epguMessageApplyState(message, doc, true)
    }

    async epguMessageProcess(message, target, save = true) {

        const doc: any = target.subType ? this.findSubdocByPath(target.subType, target.subId) : this

        if (doc) {
            await this.epguMessageApplyState(message, doc, save)
        }
    }

    async epguMessageApplyState(message, doc, save = true) {

        const state = {
            ...message.state.toJSON()
        }

        if (message.isFetched() && !message.isResultSuccess()) {
            if (doc.epguState.taskIdSuccess === message.taskId) {
                return
            }
        }

        if (message.isResultSuccess()) {

            state.taskIdSuccess = message.taskId

            if (message.entityAction === 'import') {
                state.imported = true
                state.importedDate = Date.now()
            }

            if (message.entityAction === 'export') {
                state.exported = true
                state.exportedDate = Date.now()
            }
        }

        if (doc)
          await this.epguUpdateState(state, doc)

        if (save) await this.savePromise()
    }

    async epguUpdateState(data, doc?) {

        doc = doc || this

        doc.epguState = Object.assign(doc.epguState || {}, data)
    }
}
