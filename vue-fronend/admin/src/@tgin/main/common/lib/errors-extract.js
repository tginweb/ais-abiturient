export function processGraphqlError(error, messages) {


    if (typeof error === 'string') {
        messages.push({
            message: error
        })
    } else {

        if (typeof error.message === 'string') {

            // TRANSPORT | SERVICE | ACCESS

            if (error.extensions.code === 'RATE_LIMIT') {
                messages.push({
                    level: 'ACCESS',
                    code: error.extensions.code,
                    ttl: error.extensions.ttl,
                    message: error.message
                })
            } else if (error.extensions.code == 'BAD_USER_INPUT') {
                messages.push({
                    level: 'INPUT',
                    code: error.extensions.exception && error.extensions.exception.code ? error.extensions.exception.code : error.extensions.code,
                    message: error.extensions.message
                })
            } else if (error.message === 'Validation Exception') {
                if (error.extensions) {
                    messages.push({
                        level: 'VALIDATION',
                        subtype: 'validation',
                        message: error.extensions.exception.response
                    })
                }
            } else if (error.extensions.exception) {
                messages.push(error.extensions.exception)
            } else if (error.message) {
                messages.push({message: error.message})
            }

        } else {
            messages.push({
                message: error.message
            })
        }

    }

}


export default function errorsExtract(data) {

    let messages = []

    if (typeof data == 'object') {

        if (data.networkError) {
            if (data.networkError.result && data.networkError.result.errors) {
                data.networkError.result.errors.forEach((error) => {
                    processGraphqlError(error, messages)
                })
            }
        }

        if (data.graphQLErrors) {
            data.graphQLErrors.forEach((error) => {
                processGraphqlError(error, messages)
            })
        }
    }

    //console.log(messages)

    messages.forEach((message) => {
        message.type = 'error'
        message.level = message.level || 'UNKNOWN'
    })

    return messages
}

