const modules = [
    require('./com/document/loader'),
    require('./com/template/loader'),
]

export function boot(ctx) {

}

export async function request(ctx) {

}

export function store(modules) {
    //modules.doc_admin = require('./store').default
}

export function children() {
    return modules
}
