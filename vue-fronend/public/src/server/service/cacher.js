import {config} from '~src/global'

const cacheManager = require('cache-manager');
const redisStore = require('cache-manager-redis-store');
import {md5} from '@common/core/lib/util/base';

export class RedisCacher {

  constructor(redisConf) {

    this.manager = cacheManager.caching({
      store: redisStore,
      ttl: 600,
      ...redisConf
    });

    this.client = this.manager.store.getClient()

    this.cachePresets = {
      'TEMP_SM': {
        ttl: 60
      },
      'TEMP_MD': {
        ttl: 300
      },
      'TEMP_LG': {
        ttl: 360
      },
      'TEMP_XL': {
        ttl: 600
      },
      'TEMP_XXL': {
        ttl: 1800
      },
      'PERMANENT': {}
    }
  }

  getCachePresetOptions(name) {
    return this.cachePresets[name]
  }

  async get(key, cb) {
    return this.manager.get(key, cb)
  }

  async set(key, value, options = {}) {
    return this.manager.set(key, value, options)
  }

  async clearPattern(pattern) {

    const patterns = Array.isArray(pattern) ? pattern : [pattern]

    patterns.forEach((patternItem) => {

      let stream = this.client.scanStream({match: patternItem, count: 100});
      let pipeline = this.client.pipeline()
      let localKeys = [];

      stream.on('data', (resultKeys) => {

        console.log("Data Received", resultKeys);

        for (var i = 0; i < resultKeys.length; i++) {
          localKeys.push(resultKeys[i]);
          pipeline.del(resultKeys[i]);
        }

        if (localKeys.length > 100) {
          pipeline.exec(() => {
            console.log("one batch delete complete")
          });
          localKeys = [];
          pipeline = this.client.pipeline();
        }
      });

      stream.on('end', function () {
        pipeline.exec(() => {
          console.log("final batch delete complete")
        });
      });

      stream.on('error', function (err) {
        console.log("error", err)
      })

    })

  }

  async wrapQuery(ns, query, cb) {

    let cacheParams = query.cacheTime || query.cache,
      cacheEnable = false,
      cacheCid = null,
      cacheOptions = {}

    if (cacheParams) {

      cacheEnable = true

      cacheCid = [
        'query',
        ns,
        query.queryId || 'default',
        md5(JSON.stringify(query))
      ].join(':')

      if (typeof cacheParams !== 'object') {
        if (typeof cacheParams === 'number')
          cacheParams = {ttl: cacheParams}
        else
          cacheParams = {preset: cacheParams}
      }

      cacheOptions = {
        ttl: cacheParams.ttl
      }

      if (cacheParams.preset) {
        const presetOptions = this.getCachePresetOptions(cacheParams.preset)
        if (presetOptions) {
          cacheOptions = {...cacheOptions, ...presetOptions}
        } else {
          cacheEnable = false
        }
      }
    }

    if (cacheEnable) {
      return this.manager.wrap(cacheCid, async function () {
        const res = await cb()
        res.nodes = res.nodes.map(node => node.toJSON())
        return res
      }, cacheOptions);
    } else {
      return cb()
    }
  }

  async clearTemporary() {
    await this.clearPattern(['query:*'])
  }

  async clearPermanent() {
    await this.clearPattern(['query:*'])
    await this.clearPattern(['dataloader:term:*'])
  }
}

const redisConf = config.get('REDIS')

export default new RedisCacher(redisConf)
