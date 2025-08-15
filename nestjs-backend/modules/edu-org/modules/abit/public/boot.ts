
const submodules = [
    require('./order-type/boot'),
    require('./order/boot'),
]

export function boot(module, context) {
    submodules.forEach(submodule => submodule.boot(module, context))
}

