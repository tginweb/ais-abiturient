import Vue from 'vue';

const EventEmitter = require('events')

const app = require('./app').default

const bootContext = app.createContext({
  Vue: Vue,
}, require('~src/global').default)


app.onBoot(bootContext)

export default async (ctx) => {

  ctx.store.$q = ctx.app.$q

  ctx.store.ssrContext = ctx.ssrContext

  bootContext.toRequest(ctx)

  ctx.inject('$bus', new EventEmitter())

  await app.onRequest(ctx)
}
