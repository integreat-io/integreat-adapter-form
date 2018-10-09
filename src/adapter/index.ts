import * as got from 'got'
import send from './send'
import { IAdapter } from '../../types/IAdapter'

const adapter: IAdapter = {
  authentication: 'asHttpHeaders',
  prepareEndpoint: (endpointOptions, _serviceOptions) => endpointOptions,
  connect: async (_serviceOptions, _auth, _connection) => null,
  serialize: async (request) => request,
  send: send(got),
  normalize: async (response, _request) => response,
  disconnect: async (_connection: {} | null) => {}
}

export default adapter
