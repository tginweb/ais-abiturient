
export default function htmlTrim(html) {

    if (!html) return html;

    html = html.replace(/\s*^<p>\&nbsp\;<\/p>/, "");

    html = html.replace(/<p>\&nbsp\;<\/p>\s*$/, "");
    html = html.replace(/<p>\&nbsp\;<\/p>\s*$/, "");
    html = html.replace(/<p>\&nbsp\;<\/p>\s*$/, "");
    html = html.replace(/<p>\&nbsp\;<\/p>\s*$/, "");

    return html
}

