const modules = [
    require('./loaders/util'),
    require('./loaders/date'),
    require('./loaders/store'),
    //require('./loaders/hooks'),
]

alert('MMMMSSSSS')

export function children() {
    return modules
}


