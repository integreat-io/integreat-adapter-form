type DataProperty = string | number | boolean | Date

interface Attributes {
  [key: string]: DataProperty | DataProperty[]
}

type Relationship = {
  id: string,
  type: string,
  attributes?: Attributes,
  relationships?: Relationships,
  meta?: object
}

interface Relationships {
  [key: string]: Relationship | Relationship[]
}

export type Data = {
  id: string,
  type: string,
  attributes: Attributes,
  relationships: Relationships
}

export interface Request {
  method: string,
  data?: Data | Data[] | DataProperty | null,
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
