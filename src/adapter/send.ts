import { GotFn } from 'got'
import { Request, RequestData } from '.'

const resolveMethod = (data?: RequestData) => (data) ? 'POST' : 'GET'
const generateHeaders = (method: string) => (method === 'POST')
  ? { 'Content-Type': 'application/x-www-form-urlencoded' }
  : {}

const send = (got: GotFn) => async (request: Request) => {
  const { endpoint, data } = request
  if (!endpoint || !endpoint.uri) {
    return { status: 'error', error: 'Request has no endpoint or uri' }
  }

  const method = resolveMethod(data)
  const headers = generateHeaders(method)
  const { uri } = endpoint

  const response = await got(uri, {
    method,
    body: data as string,
    headers
  })

  return {
    status: 'ok',
    data: response.body
  }
}

export default send
