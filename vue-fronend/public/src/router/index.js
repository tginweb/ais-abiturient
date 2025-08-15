import Vue from 'vue'

import builder from '@tgin/main/router/lib/router-build'
import preloader from '@tgin/main/router/lib/preloader'
import app from '~src/boot/app'

preloader({Vue})

export default function (ctx) {

  const router = {
    routes: require('./routes').default,
  }

  return builder(ctx, router, app)
}
