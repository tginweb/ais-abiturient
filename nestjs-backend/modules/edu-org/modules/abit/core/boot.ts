
const submodules = [
    require('./app-group/boot'),
    require('./app/boot'),
    require('./order/boot'),
    require('./order-type/boot'),
    require('./test/boot'),
]

export function boot(module) {
    submodules.forEach(submodule => submodule.boot(module))
}
