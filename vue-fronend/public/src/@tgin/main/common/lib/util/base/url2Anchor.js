export default function url2Anchor(url) {
    return url.replace(/^\/|\/$/g, '').replace(/\//g, '--')
}

