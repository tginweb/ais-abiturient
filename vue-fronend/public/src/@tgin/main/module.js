const modules = [
    require('./common/module'),
    require('./icon/module'),
    require('./iblock/module'),
    require('./image/module'),
    require('./router/module'),
    require('./graphql/module'),
    require('./entity/module'),
    require('./settings/module'),
    require('./rest/module'),
    require('./command/core/module'),
]


export function children() {
    return modules
}

export function boot(ctx) {

}

export async function request(ctx) {

}

export function routes(routes) {

}

export function store(modules) {

}


