export async function tokenSet(context, token) {
    context.commit('TOKEN_SET', token)
}

export async function tokenLogout(context) {
    context.commit('TOKEN_DELETE')
}

export async function fetch(context, data) {
    try {
        let {data} = await this.apollo.defaultClient.query({
            query: require('../gql/query/user.gql'),
            fetchPolicy: 'no-cache',
        })
        context.commit('USER', data.res)
        return data.res
    } catch (e) {
        console.log(e)
    }
}

export async function showNeedAuthAlert(context) {
    this.$bus.emit('processMessage', {
        message: 'Для доступа необходимо авторизовться',
        type: 'warning',
        actions: [
            {
                label: 'Войти',
                color: 'white',
                flat: false,
                dense: true,
                outline: true, handler: () => {
                    this.$router.push({name: 'user:auth'})
                }
            }
        ]
    });
}

export async function logout(context) {
    await context.dispatch('tokenLogout')
    window.location.replace('/')
}


