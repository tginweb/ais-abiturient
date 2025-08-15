import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {ApolloLink} from 'apollo-link';
import {InMemoryCache} from 'apollo-cache-inmemory';
import getApolloClientConfig from './get-apollo-client-config';
import {setContext} from 'apollo-link-context'
import {apolloClientAfterCreate, apolloClientBeforeCreate} from 'src/apollo/apollo-client-hooks';
//import {HTTPLinkDataloader} from "@tgin/main/graphql/packages/http-link-dataloader/dist/src";
import {HTTPLinkDataloader} from "http-link-dataloader";
import {randID} from "@tgin/main/common/lib/util/base";

const customFetch = (uri, options) => {

    let post = JSON.parse(options.body)

    const clientContext = {}

    clientContext.href = window.location.href

    post = {
        _query: post,
        clientContext: clientContext
    }

    options.body = JSON.stringify(post)

    return fetch(uri, options);
}


// function that returns an 'apollo client' instance
export default function ({app, router, store, urlPath, redirect}) {

    console.log('APOLLO: NO SSR')

    const cfg = getApolloClientConfig({app, router, store, urlPath, redirect});

    const commonLink = setContext(async (_, ctx) => {
        return {
            ...ctx,
            headers: {
                ...ctx.headers,
                'Client-Query-Id': store.$util.base.randID(),
                'Client-Context': JSON.stringify(store.getters['httpClientContext'])
            }
        }
    })

    const httpLink = new HttpLink(cfg.httpLinkConfig)
    const httpLinkDataloader = new HTTPLinkDataloader(cfg.httpLinkConfig)

    const hasMutation = function (operation) {
        if (operation.query.definitions.find(it => it.operation === 'mutation')) {
            return true
        }
        return false
    }

    const link = ApolloLink.split(
        hasMutation,
        commonLink.concat(httpLink),
        commonLink.concat(httpLinkDataloader),
    )

    // create apollo client cache
    const cache = new InMemoryCache(cfg.cacheConfig);

    // object that will be used to instantiate apollo client
    const apolloClientConfigObj = {link, cache, ...cfg.additionalConfig};

    // run hook before creating apollo client instance
    apolloClientBeforeCreate({
        apolloClientConfigObj,
        app,
        router,
        store,
        urlPath,
        redirect
    });

    // create an `apollo client` instance
    const apolloClient = new ApolloClient(apolloClientConfigObj);

    // run hook after creating apollo client instance
    apolloClientAfterCreate({
        apolloClient,
        app,
        router,
        store,
        urlPath,
        redirect
    });

    // return `apollo client` instance
    return apolloClient;
}
