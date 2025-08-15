import * as util from "./lib/util/index";

export function boot({Vue, inject}) {
    inject('$util.graphql', util)
}

export function store(modules) {
    modules.gql = require('./store').default
}
