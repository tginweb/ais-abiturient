import { ApolloLink, Observable, Operation } from 'apollo-link'
import { print } from 'graphql'
import { BatchedGraphQLClient } from './index'
import { HttpOptions } from './types'

export class HTTPLinkDataloader extends ApolloLink {
  constructor(options: HttpOptions) {
    super(HTTPLinkDataloader.createBatchedHttpRequest(options))
  }

  private static createBatchedHttpRequest(options: HttpOptions) {
    const { uri, ...rest } = options
    // @ts-ignore
      const client = new BatchedGraphQLClient(uri, rest)

    return (operation: Operation) =>
      new Observable(observer => {
        const {
          headers,
          uri: contextURI,
        }: Record<string, any> = operation.getContext()

        const { operationName, variables, query } = operation

        if (contextURI) {
          client.uri = contextURI
        }

        if (headers) {
          client.options = {
            ...client.options,
            headers: {
              ...client.options.headers,
              ...headers,
            },
          }
        }

        client
          .request(print(query), variables, operationName)
          .then(response => {

            operation.setContext({ response })

            observer.next(response)
            observer.complete()
            return response
          })
          .catch(err => {
            if (err.name === 'AbortError') {
              return
            }

            observer.error(err)
          })
      })
  }
}
