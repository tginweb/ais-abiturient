import generateQueryInfo from './generate-query-info'

export default function generatePageQueryInfo(name, gql, info = {}, options = {}) {

    info = {
        loadingKey: 'pageQueriesLoading',
        ...info
    }

    return generateQueryInfo(name, gql, info , options)
}

