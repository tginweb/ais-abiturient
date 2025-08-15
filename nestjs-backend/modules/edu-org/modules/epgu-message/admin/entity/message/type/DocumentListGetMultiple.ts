import {modelOptions} from "@typegoose/typegoose";
import {DocumentListGet} from "./DocumentListGet";
import {EduDocModel} from "~modules/edu-org/modules/doc/core/model";

const dayjs = require('dayjs')

@modelOptions({
    schemaOptions: {
        collection: "epgu_message",
        discriminatorKey: "type",
    }
})
export class DocumentListGetMultiple extends DocumentListGet {

    get epguEntityType() {
        return 'DocumentList'
    }

    get epguAction() {
        return 'Get'
    }

    getArgs() {
        return this.args
    }

    async generatePayload() {

        const docs: EduDocModel[] = await this.getArgEntities()
        let packets = []
        let IdObjects = []

        for (const doc of docs) {
            const packet = await this.getPacket(doc, IdObjects)
            if (packet)
                packets.push(packet)
        }

        this.args.params = {objects: IdObjects}

        await this.savePromise()

        return {
            'DocumentList': {
                'Document': packets
            }
        }
    }


}


