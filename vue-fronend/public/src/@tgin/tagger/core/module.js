const loaders = []

export function boot({Vue}) {

}

export async function request(ctx) {

}

export function store(modules) {
  modules.tagger = require('./store').default
}


