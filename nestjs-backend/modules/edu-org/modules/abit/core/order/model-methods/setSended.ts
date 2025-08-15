
export default function setSended(byUserId) {

    switch (this.state.status) {
        case 'draft':
            this.setStatus({status: 'sended'}, byUserId)
            this.sendDate = new Date()
            return true;
        case 'fix_apps':
        case 'fix_anket':
            this.setStatus({status: 'sended_fixed'}, byUserId)
            this.sendDate = new Date()
            return true
    }

    return false
}
