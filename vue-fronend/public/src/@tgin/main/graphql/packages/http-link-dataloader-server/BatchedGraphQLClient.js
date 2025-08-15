import {print} from "graphql";
import 'cross-fetch/polyfill';
import * as DataLoader from 'dataloader';
import {ClientError} from './ClientError';

import {md5} from '@tgin/main/common/lib/util/base';


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

export class BatchedGraphQLClient {
    constructor(uri, options) {

        this.load = (keys) => __awaiter(this, void 0, void 0, function* () {

            const
                requests = keys.map(k => JSON.parse(k)),
                notFoundIndexes = []

            let
                results = [],
                queriesToFetch = []


            if (options.cacher) {


                if (requests && requests.length) {

                    for (let i = 0; i < requests.length; i++) {

                        const query = requests[i]

                        let cid = 'sm-query-fetch:'

                        if (query.variables) {
                            cid = cid + query.variables.queryId + ':'
                        }

                        cid = cid + md5(JSON.stringify(query))

                        const cached = yield options.cacher.get(cid)

                        // console.log({cid, cached})

                        if (cached) {
                            results.push(cached)
                        } else {
                            results.push(null)
                            notFoundIndexes.push(i)
                            queriesToFetch.push(query)
                        }
                    }

                }

            } else {
                queriesToFetch = requests
            }

            if (queriesToFetch.length) {

                const body = JSON.stringify(queriesToFetch);

                const fetcher = this.options.fetch || fetch;

                const response = yield fetcher(
                    this.uri,
                    Object.assign({method: 'POST'}, this.options, {
                        headers: Object.assign({'Content-Type': 'application/json'}, this.options.headers),
                        body
                    }));

                const fetchedResults = yield getResults(response);

                // if it is not an array, there must be an error
                if (!Array.isArray(fetchedResults)) {
                    throw new ClientError(Object.assign({}, fetchedResults, {status: response.status}));
                }

                // check if there was an error in one of the responses
                if (!response.ok ||
                    fetchedResults.some(r => r.errors !== undefined || r.data === undefined)) {
                    const errorIndex = fetchedResults.findIndex(r => r.errors !== undefined || r.data === undefined);
                    const result = fetchedResults[errorIndex];
                    const errorResult = typeof result === 'string' ? {errors: [{message: result}]} : result;

                    throw new ClientError(Object.assign({}, errorResult, {status: response.status}));
                }

                if (options.cacher) {

                    for (let i = 0; i < fetchedResults.length; i++) {

                        const fetchedResult = fetchedResults[i]

                        const request = requests[i]

                        let cid = 'sm-query-fetch:'

                        if (request.variables) {
                            cid = cid + request.variables.queryId + ':'
                        }

                        cid = cid + md5(JSON.stringify(request))

                   //     console.log({request, res: fetchedResult.data})

                        yield options.cacher.set(cid, fetchedResult)

                        results[notFoundIndexes[i]] = fetchedResult
                    }

                } else {

                    results = fetchedResults
                }

            }

            return results.map(r => r.data);
        });

        this.uri = uri;

        const dataloaderOptions = {}

        if (options.cacheResults) {

            dataloaderOptions.cache = true;

            if (options.cacheMap) {
                dataloaderOptions.cacheMap = options.cacheMap;
            }

            if (options.cacheKeyFn) {
                dataloaderOptions.cacheKeyFn = options.cacheKeyFn;
            }
        }

        if (options.maxBatchSize) {
            dataloaderOptions.maxBatchSize = options.maxBatchSize
        }

        this.options = options || {};
        this.dataloader = new DataLoader(this.load, dataloaderOptions);
    }

    request(query, variables, operationName, http, extensions) {

        return __awaiter(this, void 0, void 0, function* () {

            const body = {
                variables: variables ? variables : undefined,
                operationName: operationName ? operationName : undefined,
            };

            if (http.includeQuery)
                body.query = print(query);

            if (http.includeExtensions)
                body.extensions = extensions;

            return this.dataloader.load(JSON.stringify(body));
        });
    }
}

function getResults(response) {
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.startsWith('application/json')) {
        return response.json();
    } else {
        return response.text();
    }
}

//# sourceMappingURL=BatchedGraphQLClient.js.map
