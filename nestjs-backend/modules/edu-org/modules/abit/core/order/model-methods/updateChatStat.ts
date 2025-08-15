export default function updateChatStat(messages) {

    // @ts-ignore
    this.chat = {};

    this.chat.messagesCount = messages.length

    this.chat.clientCount = 0;
    this.chat.companyCount = 0;

    this.chat.unreadedByClient = 0;
    this.chat.unreadedByCompany = 0;

    this.chat.lastMessageDate = null;

    // client | operator | system

    messages.forEach((msg) => {

        if ((msg.senderType == 'company' || msg.senderType == 'system')) {

            if (!msg.readedByClient)
                this.chat.unreadedByClient++;

            if (msg.senderType == 'company')
                this.chat.companyCount++;
        }

        if (msg.senderType === 'client') {
            this.chat.clientCount++
            this.chat.lastMessageDate = msg.createAt

            if (!msg.readedByCompany)
                this.chat.unreadedByCompany++;
        }
    })

}
