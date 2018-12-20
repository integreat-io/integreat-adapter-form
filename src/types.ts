export interface EndpointOptions {
  uri: string
}

export interface Request {
  action: object,
  endpoint: EndpointOptions
}

export interface ServiceOptions {
}

export interface Adapter {
  authentication: string,
  prepareEndpoint: (endpointOptions: EndpointOptions, serviceOptions?: ServiceOptions) => EndpointOptions,
  connect: (_serviceOptions: ServiceOptions, auth: {}, connection: {} | null) => Promise<{} | null>,
  serialize: (request: Request) => Promise<Request>,
  send: (request: Request) => Promise<{}>,
  normalize: (response: {}, request: Request) => Promise<{}>,
  disconnect: (_connection: {} | null) => Promise<void>
}
