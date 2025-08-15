import CConfig from './@tgin/main/common/lib/config'
//import CRegistry from '@tgin/main/common/lib/registry'
//import CContainer from '@tgin/main/common/lib/di/container'
import merge from "lodash/merge";

const EventEmitter = require('events')

export function createConfig(emitter) {

  let configData

  const appStage = process.env.APP_STAGE
  const appRunEnv = process.env.APP_MODE

  const configName = appRunEnv ? appStage + '-' + appRunEnv : appStage

  if (process.env.SERVER) {

    switch (configName) {
      case 'prod':
        configData = require('../config/prod/server')
        break
      case 'prod-dev':
        configData = require('../config/prod-dev/server')
        break
      case 'prod-local':
        configData = require('../config/prod-local/server')
        break
      case 'test':
        configData = require('../config/test/server')
        break
      case 'test-dev':
        configData = require('../config/test-dev/server')
        break
      case 'test-local':
        configData = require('../config/test-local/server')
        break
    }

  } else {

    switch (configName) {
      case 'prod':
        configData = require('../config/prod/client')
        break
      case 'prod-dev':
        configData = require('../config/prod-dev/client')
        break
      case 'prod-local':
        configData = require('../config/prod-local/client')
        break
    }
  }

  const configSharedCommon = require( '../config/.shared/common');
  const configSharedServer = require( '../config/.shared/server');

  configData = merge(configSharedCommon, configSharedServer, configData)


  return new CConfig(configData, emitter)
}

export function createEmitter() {
  return new EventEmitter()
}

export function createRegistry() {
  //return new CRegistry()
}

export function createContainer() {
  //return new CContainer();
}

export const emitter = createEmitter()
export const config = createConfig(emitter)
export const registry = createRegistry()
export const container = createContainer()
export default {emitter, config, registry, container}
