export function routerInit({Vue, router, isClientProduction}) {

    if (!isClientProduction)
        return;

    const moduleOptions = {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
        useCDN: false,
        ...this.options,
    }

    const ymUrl = (moduleOptions.useCDN ? 'https://cdn.jsdelivr.net/npm/yandex-metrica-watch' : 'https://mc.yandex.ru/metrika') + '/tag.js';

    (function (m, e, t, r, i, k, a) {
        m[i] = m[i] || function () {
            (m[i].a = m[i].a || []).push(arguments)
        };
        m[i].l = 1 * new Date();
        k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
    })
    (window, document, "script", ymUrl, "ym");

    ym(moduleOptions.id, 'init', moduleOptions)
}

export function routerAfterEach({Vue, router, to, from, isClientProduction}) {
    if (!isClientProduction)
        return;

    ym(this.options.id, 'hit', to.fullPath, {referer: from.fullPath})
}

