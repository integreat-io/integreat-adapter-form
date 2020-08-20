import got = require('got')
import send from './send'
import serialize from './serialize'
import normalize from './normalize'

export type DataProperty = string | number | boolean | Record<string, unknown>

interface Data {
  [key: string]: DataProperty
}

export type RequestData = Data | Data[] | DataProperty | null

export interface Request {
  method: string
  data?: RequestData
  endpoint?: EndpointOptions
  headers?: Record<string, string>
}

export interface Response {
  status: string
  data?: unknown
  error?: string
}

export interface EndpointOptions {
  uri: string
}

export type ServiceOptions = Record<string, unknown>

export default {
  authentication: 'asHttpHeaders',

  prepareEndpoint: (
    endpointOptions: EndpointOptions,
    _serviceOptions?: ServiceOptions
  ): EndpointOptions => endpointOptions,

  connect: async (
    _serviceOptions: ServiceOptions,
    _auth: Record<string, unknown> | null,
    _connection: Record<string, unknown> | null
  ): Promise<Record<string, unknown> | null> => null,

  serialize,

  send: send((got as unknown) as got.GotRequestFunction),

  normalize,

  disconnect: async (
    _connection: Record<string, unknown> | null
  ): Promise<void> => {
    return
  },
}
