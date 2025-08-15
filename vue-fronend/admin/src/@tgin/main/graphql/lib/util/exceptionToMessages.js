import exceptionInfo from './exceptionInfo'

export default function exceptionToMessages(e) {
    const {messages, errorCategory} = exceptionInfo(e)
    return messages
}
