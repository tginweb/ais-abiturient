import Service from './service/entity'
import ServiceRegistry from './service/registry'

export function store(modules) {
    modules.entity = require('./store').default
}

export function scopeQuery(query, name) {
    switch (name) {
        case 'app':
         //   query = query.add(require('./gql/scope/app.gql'), {})
            break
    }
    return query
}

export function boot(ctx) {

    ctx.inject('$entityRegistry', new ServiceRegistry(ctx))
}

export async function request(ctx) {
    ctx.inject('$entity', new Service(ctx))
}


