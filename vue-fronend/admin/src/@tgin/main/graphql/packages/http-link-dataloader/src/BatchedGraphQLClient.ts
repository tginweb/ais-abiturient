import {Options, Variables} from './types'
import 'cross-fetch/polyfill'
import * as DataLoader from 'dataloader'
import {ClientError} from './ClientError'
import {ClientOptions} from '.'

export class BatchedGraphQLClient {
    public uri: string
    public options: any
    private dataloader: DataLoader<string, any>

    constructor(uri: string, options?: Options & ClientOptions) {
        this.uri = uri

        const cache =
            options && typeof options.cacheResults !== 'undefined'
                ? options.cacheResults
                : false

        if (options && typeof options.cacheResults !== 'undefined') {
            delete options.cacheResults
        }

        const maxBatchSize =
            options && typeof options.maxBatchSize !== 'undefined'
                ? options.maxBatchSize
                : null

        if (options && typeof options.maxBatchSize !== 'undefined') {
            delete options.maxBatchSize
        }

        const dataloaderParams: any = {
            cache
        }

        if (maxBatchSize) {
            dataloaderParams.maxBatchSize = maxBatchSize
        }

        this.options = options || {}
        this.dataloader = new DataLoader(this.load, dataloaderParams)
    }

    async request<T extends any>(
        query: string,
        variables?: Variables,
        operationName?: string,
    ): Promise<T> {
        const body = JSON.stringify({
            query,
            variables: variables ? variables : undefined,
            operationName: operationName ? operationName : undefined,
        })
        return this.dataloader.load(body)
    }

    load = async (keys: string[]): Promise<any> => {

        const requests = keys.map(k => JSON.parse(k))

        const body = JSON.stringify(requests)

        const response = await fetch(this.uri, {
            method: 'POST',
            ...this.options,
            headers: Object.assign(
                {'Content-Type': 'application/json'},
                this.options.headers,
            ),
            body,
        })

        const results = await getResults(response)

        // if it is not an array, there must be an error
        if (!Array.isArray(results)) {
            throw new ClientError({...results, status: response.status})
        }

        let index = 0;

        for (let r of results) {
            if (r.errors !== undefined || r.data === undefined) {
                if (!requests[index].variables || !requests[index].variables.skipBatchErrors) {
                    const errorResult = typeof r === 'string' ? {errors: [{message: r}]} : r
                    throw new ClientError({...errorResult, status: response.status})
                }
            }
            index++
        }

        return results.map(r => {
           const res : any = {
               data: r.data
           }

           if (r.errors) {
               res.errors = r.errors
           }

           return res
        })
    }
}

function getResults(response: Response): Promise<any> {
    const contentType = response.headers.get('Content-Type')
    if (contentType && contentType.startsWith('application/json')) {
        return response.json()
    } else {
        return response.text()
    }
}
