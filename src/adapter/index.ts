import got = require('got')
import { Adapter } from '../types'
import send from './send'
import normalize from './normalize'

const adapter: Adapter = {
  authentication: 'asHttpHeaders',
  prepareEndpoint: (endpointOptions, _serviceOptions) => endpointOptions,
  connect: async (_serviceOptions, _auth, _connection) => null,
  serialize: async (request) => request,
  send: send(got),
  normalize,
  disconnect: async (_connection: {} | null) => {}
}

export default adapter
