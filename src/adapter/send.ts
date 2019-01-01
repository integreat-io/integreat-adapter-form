import { GotFn } from 'got'
import { Request } from '../types'

const send = (got: GotFn) => async (request: Request) => {
  const { endpoint } = request
  if (!endpoint || !endpoint.uri) {
    return { status: 'error', error: 'Request has no endpoint or uri' }
  }
  const method = 'GET'
  const headers = {}
  const { uri } = endpoint

  const response = await got(uri, {
    method,
    // body,
    headers
  })

  return {
    status: 'ok',
    data: response.body
  }
}

export default send
