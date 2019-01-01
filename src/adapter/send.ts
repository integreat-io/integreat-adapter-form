import { GotFn } from 'got'
import { Request } from '../types'

const send = (got: GotFn) => async (request: Request) => {
  const { endpoint, data } = request
  if (!endpoint || !endpoint.uri) {
    return { status: 'error', error: 'Request has no endpoint or uri' }
  }
  const method = (data) ? 'POST' : 'GET'
  const headers = (method === 'POST')
    ? { 'Content-Type': 'application/x-www-form-urlencoded' }
    : {}
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
