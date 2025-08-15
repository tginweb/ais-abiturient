const queryString = require('query-string');

export function onRouteFirstResolved($store) {

    setTimeout(() => {

        const hash = location.hash

        if (hash) {
            const hashValue = hash.substring(1)
            const hashNav = queryString.parseUrl(hashValue)

            if (hashNav.url) {
                const [hashNavNs, hashNavUrl] = hashNav.url.split(':')

                switch (hashNavNs) {
                    case 'vroute':

                        $store.dispatch('router/vrouterPush', {
                            is: hashNavUrl,
                            hashUrl: true,
                            ...hashNav.query
                        })

                        break
                }
            }
        }

    }, 500)

}
