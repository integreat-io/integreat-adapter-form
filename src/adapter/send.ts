import { GotFn } from 'got'
import { Request, RequestData, Response } from '.'

export interface HttpError extends Error {
  statusCode: number,
  response: { body?: string }
}

const createError = ({ statusCode, message }: HttpError, uri: string) => {
  switch (statusCode) {
    case 404: return { status: 'notfound', error: `Could not find the url ${uri}` }
    case 401: return { status: 'noaccess', error: `Service requires authentication for ${uri}` }
  }
  return { status: 'error', error: `Server returned ${statusCode} error for ${uri}. ${message}` }
}

const resolveMethod = (data?: RequestData) => (data) ? 'POST' : 'GET'
const generateHeaders = (method: string) => (method === 'POST')
  ? { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
  : {}

const send = (got: GotFn) => async (request: Request): Promise<Response> => {
  const { endpoint, data } = request
  if (!endpoint || !endpoint.uri) {
    return { status: 'error', error: 'Request has no endpoint or uri' }
  }

  const method = resolveMethod(data)
  const headers = generateHeaders(method)
  const { uri } = endpoint

  try {
    const response = await got(uri, {
      method,
      body: data as string,
      headers
    })

    return {
      status: 'ok',
      data: response.body
    }
  } catch (error) {
    return { ...createError(error, uri), data: error.response && error.response.body }
  }
}

export default send
