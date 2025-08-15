import {RequestError} from "@tgin/main/common/lib/error";
import { Dialog } from 'quasar'

export async function mutation(context, {
    cb,
    dispatch,
    payload,
    mutation,
    variables,
    state = {},
    throwInternalError = true,
    throwUserError = true,
    returnResult = true,
    confirm = false,
    ctx = {
        response: null,
        payload: null,
        result: null,
        state: {},
        messages: [],
        errors: []
    }
}) {

    const caller = async () => {

        const mState = state

        mState.process = true
        mState.mutating = true

        let err

        try {

            if (cb) {
                ctx.response = await cb()
            } else if (dispatch) {
                console.log('dispatch')
                ctx.response = await context.dispatch(dispatch, payload, {root: true})
            } else if (mutation) {
                ctx.response = await this.apollo.defaultClient.mutate({
                    mutation: mutation,
                    variables: variables || {}
                })
            }

        } catch (e) {


            const {messages, error} = this.$util.graphql.exceptionInfo(e)

            this.$bus.emit('processMessages', messages)

            err = error ? new RequestError(error.message, error) : e
        }


        if (!err) {

            if (ctx.response && typeof ctx.response === 'object') {

                if (ctx.response.data) {
                    ctx.result = (typeof ctx.response.data === 'object') && (typeof ctx.response.data.res !== 'undefined') ? ctx.response.data.res : ctx.response.data
                }

                ctx.state =
                    this.$util.base.deepGet(ctx.response, 'data.res.result') ||
                    this.$util.base.deepGet(ctx.response, 'data.res.state') ||
                    this.$util.base.deepGet(ctx.response, 'extensions.state')

                ctx.payload = this.$util.base.deepGet(ctx.response, 'data.res.payload') || this.$util.base.deepGet(ctx.response, 'extensions.payload')

                if (ctx.state) {

                    ctx.messages = ctx.state.messages || []
                    ctx.errors = ctx.messages.filter(item => item.type === 'error')

                    const errorMessage = ctx.errors[0]

                    this.$bus.emit('processResponse', ctx.state);

                    if (errorMessage) {
                        err = new RequestError(errorMessage.message, errorMessage, ctx)
                    } else if (ctx.state.success === false) {
                        err = new RequestError('Unsuccessful response', {category: 'user'}, ctx)
                    }
                }

            } else {

            }
        }

        mState.process = false
        mState.mutating = false

        if (err) {
            if (err.category === 'user') {
                if (throwUserError)
                    throw err
            } else {
                if (throwInternalError)
                    throw err
            }
        }

        mState.mutated = true

        return returnResult ? ctx.result : ctx
    }

    return new Promise((resolve, reject) => {
        try {
            if (confirm) {
                Dialog.create({
                    title: confirm.title,
                    message: confirm.message,
                    cancel: true,
                }).onOk(() => {
                    resolve(caller())
                }).onCancel(() => {
                    reject()
                })
            } else {
                resolve(caller())
            }
        } catch (e) {
            reject(e)
        }
    })
}


export async function fetch(context, {
    cb,
    dispatch,
    payload,
    query,
    variables,
    fetchPolicy = 'no-cache',
    state = {},
    throwInternalError = true,
    throwUserError = true,
    returnResult = true,
    setFetched = true,
    ctx = {
        response: null,
        payload: null,
        result: null,
        state: {},
        messages: [],
        errors: []
    }
}) {

    const mState = state

    mState.process = true
    mState.fetching = true

    let err

    try {

        if (cb) {
            ctx.response = await cb()
        } else if (dispatch) {
            ctx.response = await context.dispatch(dispatch, payload, {root: true})
        } else if (query) {
            ctx.response = await this.apollo.defaultClient.query({
                query: query,
                variables: variables || {},
                fetchPolicy: fetchPolicy
            })
        }

    } catch (e) {

        const {messages, error} = this.$util.graphql.exceptionInfo(e)

        this.$bus.emit('processMessages', messages)

        err = error ? new RequestError(error.message, error) : e
    }

    if (!err) {

        if (ctx.response && typeof ctx.response === 'object') {

            if (ctx.response.data) {
                ctx.result = (typeof ctx.response.data === 'object') && (typeof ctx.response.data.res !== 'undefined') ? ctx.response.data.res : ctx.response.data
            }

            ctx.state = this.$util.base.deepGet(ctx.response, 'data.res.state') || this.$util.base.deepGet(ctx.response, 'extensions.state')
            ctx.payload = this.$util.base.deepGet(ctx.response, 'data.res.payload') || this.$util.base.deepGet(ctx.response, 'extensions.payload')

            if (ctx.state) {

                ctx.messages = ctx.state.messages || []
                ctx.errors = ctx.messages.filter(item => item.type === 'error')

                const errorMessage = ctx.errors[0]

                this.$bus.emit('processResponse', ctx.state);


                if (errorMessage) {
                    err = new RequestError(errorMessage.message, errorMessage, ctx)
                } else if (ctx.state.success === false) {
                    err = new RequestError('Unsuccessful response', {category: 'user'}, ctx)
                }
            }

        } else {

        }
    }

    mState.process = false
    mState.fetching = false

    if (err) {
        if (err.category === 'user') {
            if (throwUserError)
                throw err
        } else {
            if (throwInternalError)
                throw err
        }
    }

    if (setFetched)
        mState.fetched = true

    return returnResult ? ctx.result : ctx
}
