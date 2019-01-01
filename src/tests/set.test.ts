import test from 'ava'
import nock = require('nock')

import resources from '..'
const { form: adapter } = resources.adapters

// Helpers

test.after.always(() => {
  nock.restore()
})

// Tests

test('should set data', async (t) => {
  const formRequest = 'client_id=t0k3n&' +
    'redirect_uri=http%3A%2F%2Fredirect.com%2Fto%2Fthis.html&' +
    'text=Several+words+here&' +
    'object=%7B%22id%22%3A%22ent1%22%2C%22type%22%3A%22entry%22%7D'
  nock('http://test.com')
    .post('/form', formRequest)
    .reply(200, 'ok')
  const request = {
    method: 'QUERY',
    data: {
      client_id: 't0k3n',
      redirect_uri: 'http://redirect.com/to/this.html',
      text: 'Several words here',
      object: { id: 'ent1', type: 'entry' }
    },
    endpoint: {
      uri: 'http://test.com/form'
    }
  }

  const serializedRequest = await adapter.serialize(request)
  const ret = await adapter.send(serializedRequest)

  t.is(ret.status, 'ok')
  t.is(ret.data, 'ok')
})
