import VueHtmlToPaper from "vue-html-to-paper";

export function boot({Vue}) {

  Vue.use(VueHtmlToPaper, {
    name: "_blank",
    specs: ["fullscreen=yes", "titlebar=yes", "scrollbars=yes"],
    styles: [
      "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
      "https://unpkg.com/kidlat-css/css/kidlat.css",
      "/statics/tpl-print.css"
    ]
  })

}

export function request(ctx) {

}

