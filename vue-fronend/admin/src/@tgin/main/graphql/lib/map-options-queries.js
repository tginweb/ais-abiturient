import generateResultQuery from './generate-result-query'

export default function mapOptionsQueries(items) {

    const result = {}

    Object.keys(items).forEach((key) => {
        result[key] = generateResultQuery(key, items[key])
    })

    return result
}
