import classToArray from './classToArray'

export default function classMerge(cls1, cls2) {

    const typesEqual = (typeof cls1) === (typeof cls2)

    if (!typesEqual) {
        return [...classToArray(cls1), ...classToArray(cls2)]
    }

    if (typeof cls1 === 'object') {
        if (Array.isArray(cls1)) {
            return [...cls1, ...cls2]
        } else {
            return {
                ...cls1,
                ...cls2
            }
        }
    } else if (typeof cls1 === 'string') {
        return cls1 + ' ' + cls2
    }

}
