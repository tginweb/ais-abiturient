export default function styleExtend(dest, source, toString = false) {

    let target = {}

    if (dest) {
        if (Array.isArray(dest)) {
            for (const [key, value] of Object.entries(dest)) {
                const [cssName, cssValue] = value.split(':')
                target[cssName] = cssValue
            }
        } else if (typeof dest === 'string') {
            for (const [key, value] of Object.entries(dest.split(';'))) {
                const [cssName, cssValue] = value.split(':')
                target[cssName] = cssValue
            }
        } else {
            target = dest
        }
    }

    if (source) {
        if (typeof source === 'object') {
            if (Array.isArray(source)) {
                for (const [key, value] of Object.entries(source)) {
                    const [cssName, cssValue] = value.split(':')
                    target[cssName] = cssValue
                }
            } else {
                for (const [key, value] of Object.entries(source)) {
                    if (value == true) {
                        const [cssName, cssValue] = key.split(':')
                        target[cssName] = cssValue
                    } else if (value == false) {
                    } else {
                        target[key] = value
                    }
                }
            }
        } else if (typeof source === 'string') {
            for (const [key, value] of Object.entries(source.split(';'))) {
                const [cssName, cssValue] = value.split(':')
                target[cssName] = cssValue
            }
        }
    }

    if (toString) {

        let res = '';

        for (let [key, value] of Object.entries(target)) {
            if (value) {
                key = key.replace(/[\w]([A-Z])/g, function (m) {
                    return m[0] + "-" + m[1];
                }).toLowerCase()
                res = res + key + ':' + value + ';'
            }
        }

        return res;
    }

    return target
}
