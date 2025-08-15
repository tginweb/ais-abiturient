export default class {

    constructor(ctx) {
        this.ctx = ctx

        this.loadParams();

        ctx.$config.on('updated', () => {
            this.loadParams();
        })
    }

    loadParams() {
        this.params = this.ctx.$config.get('IMAGE.STYLER', {})

        if (!this.params)
            this.params.SITE_URL = this.ctx.$config.get('SITE_URL')

        this.imageSizes = this.ctx.$config.get('STORAGE.IMAGE_SIZES', {})
    }

    resolveUrl(url, style) {

        return url;

        if ((this.ctx.$app.isDev() || process.env.APP_MODE === 'local') && this.ctx.$config.get('CATALOG.DEV.ENTITY_IMAGE_URL')) {
            url = this.ctx.$config.get('CATALOG.DEV.ENTITY_IMAGE_URL')
        }

        let width, height, crop

        if (typeof style === 'string') {
            let size = this.imageSizes[style]
            if (size) {
                [width, height] = size.args
                crop = size.op === 'crop'
            }
        } else {
            [width, height, crop] = style
        }

        const params = {}

        params.f = 'auto'
        params.c = crop ? 'thumb' : 'limit'

        if (width)
            params.w = width
        if (height)
            params.h = height

        const parts = [];

        for (let key in params) {
            parts.push(key + '_' + params[key])
        }

        let res = url.charAt(0) === '/' ? this.params.SITE_URL + url : url

        res = 'https://res.cloudinary.com/' + this.params.CLOUD_ID + '/image/fetch/' + parts.join(',') + '/' + res;

        return res;
    }
}

