import axios from 'axios'

export function boot({Vue, inject, $config}) {

}

export function request({inject, $config, ssrContext}) {

  const baseUrl = $config.get('API_REST_URL');

  const axiosRequestConfig = {
    baseURL: baseUrl
  }

  if (ssrContext) {
    axiosRequestConfig.headers = ssrContext.req.headers
  }

  const axiosApi = axios.create(axiosRequestConfig)

  inject('$api', axiosApi)

  inject('$apiUrl', (url) => {
    return baseUrl + url
  })

  // axiosOptions.headers.common = (ctx.req && ctx.req.headers) ? Object.assign({}, ctx.req.headers) : {}
}
