export default function exceptionToMessages(e) {

    let messages = []

    if (e.graphQLErrors) {

        Array.prototype.push.apply(messages, e.graphQLErrors.map(error => {

            let message = error.message

            if (error.debugMessage) {
                message = message + '<br>' + error.debugMessage
            }

            return {
                type: 'error',
                message: message,
                ...(error.extensions || {})
            }
        }))
    }

    if (e.networkError && e.networkError.result && e.networkError.result.errors) {

        const errors = e.networkError.result.errors

        Array.prototype.push.apply(messages, errors.map(error => {

            let message = error.message

            if (error.debugMessage) {
                message = message + '<br>' + error.debugMessage
            }

            return {
                type: 'error',
                message: message,
                ...(error.extensions || {})
            }
        }))
    }

    return {
        messages,
        error: messages[0]
    }
}
