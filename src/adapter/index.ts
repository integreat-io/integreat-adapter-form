import got = require('got')
import send from './send'
import serialize from './serialize'
import normalize from './normalize'

type DataProperty = string | number | boolean | object

interface Data {
  [key: string]: DataProperty
}

export type RequestData = Data | Data[] | DataProperty | null

export interface Request {
  method: string,
  data?: RequestData,
  endpoint?: EndpointOptions
}

export interface Response {
  status: string,
  data?: any,
  error?: string
}

export interface EndpointOptions {
  uri: string
}

export interface ServiceOptions {
}

export interface Adapter {
  authentication: string,
  prepareEndpoint: (endpointOptions: EndpointOptions, serviceOptions?: ServiceOptions) => EndpointOptions,
  connect: (_serviceOptions: ServiceOptions, auth: {}, connection: {} | null) => Promise<{} | null>,
  serialize: (request: Request) => Promise<Request>,
  send: (request: Request) => Promise<Response>,
  normalize: (response: Response, request: Request) => Promise<Response>,
  disconnect: (_connection: {} | null) => Promise<void>
}

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
