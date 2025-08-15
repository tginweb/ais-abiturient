import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import getApolloClientConfig from './get-apollo-client-config';
import {apolloClientAfterCreate, apolloClientBeforeCreate} from 'src/apollo/apollo-client-hooks';
import {setContext} from 'apollo-link-context'
//import {HTTPLinkDataloader} from "@tgin/main/graphql/packages/http-link-dataloader/dist/src";
import {HTTPLinkDataloader} from "http-link-dataloader";
import {onError} from 'apollo-link-error';

const onServer = process.env.SERVER;

export default function ({app, router, store, ssrContext, urlPath, redirect}) {

  console.log('APOLLO: SSR')

  const cfg = getApolloClientConfig({
        app,
        router,
        store,
        ssrContext,
        urlPath,
        redirect
    });

    if (onServer) {
        cfg.httpLinkConfig.fetch = require('node-fetch').default;
    }

    const authLink = setContext(async (_, ctx) => {

        console.log('authLink')

        if (ssrContext) {
            const result = {
                ...ctx
            }
            result.headers = {
                ...result.headers,
                cookie: ssrContext.req.headers.cookie
            }
            return result
        }

        return ctx
    })

    const errorLink = onError(({graphQLErrors, networkError}) => {
        if (graphQLErrors)
            graphQLErrors.forEach(({message, locations, path}) =>
                console.log(
                    `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                ),
            );

        if (networkError) console.log(`[Network error]: ${networkError}`);
    })

    const httpLinkDataloader = onServer ? new HTTPLinkDataloader(cfg.httpLinkConfig) : new HTTPLinkDataloader(cfg.httpLinkConfig)

    const link = authLink.concat(errorLink).concat(httpLinkDataloader)

    const cache = new InMemoryCache(cfg.cacheConfig);

    // If on the client, recover the cache state injected by the server
    if (!onServer && typeof window !== 'undefined' && window.__APOLLO_STATE__) {
        cache.restore(window.__APOLLO_STATE__.defaultClient);
    }

    // object that will be used to instantiate apollo client
    const apolloClientConfigObj = {link, cache, ...cfg.additionalConfig};

    // run hook before creating apollo client instance
    apolloClientBeforeCreate({
        apolloClientConfigObj,
        app,
        router,
        store,
        ssrContext,
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
        ssrContext,
        urlPath,
        redirect
    });

    // return `apollo client` instance
    return apolloClient;
}
