var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import {ApolloLink, Observable} from 'apollo-link';
import {BatchedGraphQLClient} from './index';

export class HTTPLinkDataloaderServer extends ApolloLink {
    constructor(options) {
        super(HTTPLinkDataloaderServer.createBatchedHttpRequest(options));
    }

    static createBatchedHttpRequest(options) {
        const {uri} = options, rest = __rest(options, ["uri"]);
        const client = new BatchedGraphQLClient(uri, rest);
        return (operation) => new Observable(observer => {
            const {headers, uri: contextURI, http} = operation.getContext();

            const {operationName, variables, query, extensions} = operation;

            if (contextURI) {
                client.uri = contextURI;
            }

            if (headers) {
                client.options = Object.assign({}, client.options, {headers: Object.assign({}, client.options.headers, headers)});
            }

            client
                .request(query, variables, operationName, http, extensions)
                .then(response => {
                    operation.setContext({response});
                    observer.next({data: response});
                    observer.complete();
                    return response;
                })
                .catch(err => {
                    if (err.name === 'AbortError') {
                        return;
                    }

                    if (err.result && err.result.errors && err.result.data) {
                        observer.next(err.result);
                    }

                    observer.error(err);
                });
        });
    }
}

//# sourceMappingURL=HTTPLinkDataloader.js.map
