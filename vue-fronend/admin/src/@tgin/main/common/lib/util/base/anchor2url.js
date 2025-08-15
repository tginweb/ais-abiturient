export default function anchor2url(url) {
    return '/' + url.replace(/\#/g, '').replace(/\-\-/g, '/', url)
}

