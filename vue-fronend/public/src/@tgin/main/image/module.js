import CProviderCloudinry from  './providers/cloudinry/client'

export function boot(ctx) {
  ctx.inject('$image', new CProviderCloudinry(ctx))
}


