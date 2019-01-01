import test from 'ava'
import sinon = require('sinon')

import send from './send'

test('should GET from uri', async (t) => {
  const got = sinon.stub().resolves({ body: 'key=value' })
  const request = {
    method: 'QUERY',
    endpoint: { uri: 'http://form.com/theform' }
  }
  const expected = {
    status: 'ok',
    data: 'key=value'
  }

  const ret = await send(got)(request)

  t.deepEqual(ret, expected)
  t.is(got.callCount, 1)
  t.is(got.args[0][0], 'http://form.com/theform')
  const callOptions = got.args[0][1]
  t.is(callOptions.method, 'GET')
})

test('should use POST when request data is set', async (t) => {
  const got = sinon.stub().resolves({ body: 'key=value' })
  const request = {
    method: 'MUTATION',
    data: { value: 1, text: 'Some text' },
    endpoint: { uri: 'http://form.com/theform' }
  }
  const expected = {
    status: 'ok',
    data: 'key=value'
  }

  const ret = await send(got)(request)

  t.deepEqual(ret, expected)
  t.is(got.callCount, 1)
  t.is(got.args[0][0], 'http://form.com/theform')
  const callOptions = got.args[0][1]
  t.is(callOptions.method, 'POST')
})

test('should return error when no uri or endpoint', async (t) => {
  const got = sinon.stub().resolves({ body: 'key=value' })
  const request = { method: 'QUERY' }

  const ret = await send(got)(request)

  t.is(ret.status, 'error')
})
