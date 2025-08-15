export default function (props, com) {
    return Object.keys(props).reduce((map, prop) => {
        if (typeof com[prop] !== 'undefined') {
            map[prop] = com[prop]
        }
        return map
    }, {})
}
