const loaders = [

]

export function boot(ctx) {

}

export async function request(ctx) {

}

export function store(modules) {
  modules.menu_admin = require('./store').default
}

