import test from 'ava'
import nock = require('nock')

import resources from '..'
const { form: adapter } = resources.adapters

// Helpers

test.after.always(() => {
  nock.restore()
})

// Tests

test('should get data', async (t) => {
  const formResponse =
    'value=1&text=Several+words+here&object=%7B%22id%22%3A%22ent1%22%2C%22type%22%3A%22entry%22%7D'
  nock('http://test.com').get('/form').reply(200, formResponse)
  const request = {
    method: 'QUERY',
    endpoint: {
      uri: 'http://test.com/form',
    },
  }
  const expectedData = {
    value: 1,
    text: 'Several words here',
    object: { id: 'ent1', type: 'entry' },
  }

  const response = await adapter.send(request)
  const ret = await adapter.normalize(response, request)

  t.is(ret.status, 'ok')
  t.deepEqual(ret.data, expectedData)
})

test('should return notfound on 404', async (t) => {
  nock('http://test.com').get('/notknown').reply(404)
  const request = {
    method: 'QUERY',
    endpoint: {
      uri: 'http://test.com/notknown',
    },
  }

  const response = await adapter.send(request)
  const ret = await adapter.normalize(response, request)

  t.is(ret.status, 'notfound')
})

test('should return body data on error', async (t) => {
  nock('http://test.com').get('/error').reply(400, 'error=There+was+an+error')
  const request = {
    method: 'QUERY',
    endpoint: {
      uri: 'http://test.com/error',
    },
  }
  const expectedData = {
    error: 'There was an error',
  }

  const response = await adapter.send(request)
  const ret = await adapter.normalize(response, request)

  t.is(ret.status, 'error')
  t.deepEqual(ret.data, expectedData)
})
