export default function classToObject(val, target = {}) {

    if (val) {
        if (typeof val === 'object') {
            if (Array.isArray(val)) {
                let cls
                for (cls in val) {
                    target[cls] = true
                }
            } else {
                target = {
                    ...target,
                    ...val
                }
            }
        } else if (typeof val === 'string') {
            let cls
            for (cls in val.split(' ')) {
                target[cls] = true
            }
        }
    }

    return target

}
