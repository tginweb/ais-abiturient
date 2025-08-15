import {modelOptions, plugin, prop} from "@typegoose/typegoose";

export class DocState {

    @prop({cfilter: true, default: 'send'})
    step: string // send | fetch | process

    @prop({cfilter: true, default: 'await'})
    status: string // await | process | success | error

    @prop({})
    statusMessage: string[]

    @prop({cfilter: true, default: false})
    processed: boolean

    @prop({cfilter: true, default: false})
    running: boolean
}



