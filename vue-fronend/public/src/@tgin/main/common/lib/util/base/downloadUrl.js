export default function downloadUrl(url) {
    var link = window.document.createElement("a")
    link.href = url
    link.target = '_blank'
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
}

