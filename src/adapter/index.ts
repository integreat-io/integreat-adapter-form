import got = require('got')
import { Adapter } from '../types'
import send from './send'
import serialize from './serialize'
import normalize from './normalize'

const adapter: Adapter = {
  authentication: 'asHttpHeaders',
  prepareEndpoint: (endpointOptions, _serviceOptions) => endpointOptions,
  connect: async (_serviceOptions, _auth, _connection) => null,
  serialize,
  send: send(got),
  normalize,
  disconnect: async (_connection: {} | null) => { return }
}

export default adapter
