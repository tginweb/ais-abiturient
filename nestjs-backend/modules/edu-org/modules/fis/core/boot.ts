
const submodules = [
    require('./service/boot'),
    require('./message/boot'),
]

export function boot(module, context) {
    submodules.forEach(submodule => submodule.boot(module, context))
}

export function menuItems(menuItems) {
    submodules.forEach(submodule => submodule.menuItems && submodule.menuItems(menuItems))
}

