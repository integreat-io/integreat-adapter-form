import { IRequest } from './IRequest'
import { IEndpointOptions } from './IEndpointOptions'
import { IServiceOptions } from './IServiceOptions'

export interface IAdapter {
  authentication: string,
  prepareEndpoint: (endpointOptions: IEndpointOptions, serviceOptions?: IServiceOptions) => IEndpointOptions,
  connect: (_serviceOptions: IServiceOptions, auth: {}, connection: {} | null) => Promise<{} | null>,
  serialize: (request: IRequest) => Promise<IRequest>,
  send: (request: IRequest) => Promise<{}>,
  normalize: (response: {}, request: IRequest) => Promise<{}>,
  disconnect: (_connection: {} | null) => Promise<void>
}
