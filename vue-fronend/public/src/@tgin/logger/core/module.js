const loaders = []

export function boot({Vue}) {

}

export async function request(ctx) {

}

export function store(modules) {
  modules.logger = require('./store').default
}


