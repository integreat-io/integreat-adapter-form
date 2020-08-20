import { GotRequestFunction, Response as GotResponse } from 'got'
import { Request, RequestData, Response } from '.'

interface Endpoint {
  uri: string
}

const createError = (
  { statusCode, statusMessage }: GotResponse,
  uri: string
) => {
  switch (statusCode) {
    case 404:
      return { status: 'notfound', error: `Could not find the url ${uri}` }
    case 401:
      return {
        status: 'noaccess',
        error: `Service requires authentication for ${uri}`,
      }
  }
  return {
    status: 'error',
    error: `Server returned ${statusCode} error for ${uri}. ${statusMessage}`,
  }
}

const resolveMethod = (data?: RequestData) => (data ? 'POST' : 'GET')
const generateHeaders = (method: string) =>
  method === 'POST'
    ? { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
    : {}

const isEndpointWithUri = (endpoint?: Endpoint | null): endpoint is Endpoint =>
  !!(endpoint && endpoint.uri)

export default (got: GotRequestFunction) =>
  async function send(request: Request): Promise<Response> {
    const { endpoint, data, headers } = request

    if (!isEndpointWithUri(endpoint)) {
      return { status: 'error', error: 'Request has no endpoint or uri' }
    }

    const method = resolveMethod(data)

    const response = await got(endpoint.uri, {
      method,
      body: data as string,
      headers: {
        ...generateHeaders(method),
        ...headers,
      },
      throwHttpErrors: false,
    })

    if (response.statusCode < 400) {
      return {
        status: 'ok',
        data: response.body,
      }
    } else {
      return {
        ...createError(response, endpoint.uri),
        data: response.body,
      }
    }
  }
