export default function declareQueries(items) {
    return items.reduce((map, o) => (map[o._queryName] = o, map), {})
}
