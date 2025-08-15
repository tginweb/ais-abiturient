
const submodules = [
    require('./common/boot'),
    require('./app/boot'),
    require('./order/boot'),
    require('./test/boot'),
]

export function boot(module, context) {
    submodules.forEach(submodule => submodule.boot(module, context))
}

export function menuItems(menuItems) {
    submodules.forEach(submodule => submodule.menuItems && submodule.menuItems(menuItems))
}
