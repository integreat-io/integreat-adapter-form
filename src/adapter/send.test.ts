import test from 'ava'
import sinon = require('sinon')

import send from './send'

test('should GET from uri', async (t) => {
  const got = sinon.stub().resolves({ statusCode: 200, body: 'key=value' })
  const request = {
    method: 'GET',
    endpoint: { uri: 'http://form.com/theform' },
  }
  const expected = {
    status: 'ok',
    data: 'key=value',
  }

  const ret = await send(got)(request)

  t.deepEqual(ret, expected)
  t.is(got.callCount, 1)
  t.is(got.args[0][0], 'http://form.com/theform')
  const callOptions = got.args[0][1]
  t.is(callOptions.method, 'GET')
  t.deepEqual(callOptions.headers, {})
})

test('should use POST when request data is set', async (t) => {
  const got = sinon.stub().resolves({ statusCode: 200, body: 'key=value' })
  const request = {
    method: 'SET',
    data: { value: 1, text: 'Some text' },
    endpoint: { uri: 'http://form.com/theform' },
  }
  const expected = {
    status: 'ok',
    data: 'key=value',
  }
  const expectedHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  }

  const ret = await send(got)(request)

  t.deepEqual(ret, expected)
  t.is(got.callCount, 1)
  t.is(got.args[0][0], 'http://form.com/theform')
  const callOptions = got.args[0][1]
  t.is(callOptions.method, 'POST')
  t.deepEqual(callOptions.headers, expectedHeaders)
})

test('should include request headers', async (t) => {
  const got = sinon.stub().resolves({ statusCode: 200, body: 'key=value' })
  const request = {
    method: 'SET',
    data: { value: 1, text: 'Some text' },
    headers: { Authorization: 'Basic Y2xpZW50MTpzM2NyM3Q=' },
    endpoint: { uri: 'http://form.com/theform' },
  }
  const expectedHeaders = {
    Authorization: 'Basic Y2xpZW50MTpzM2NyM3Q=',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  }

  await send(got)(request)

  t.is(got.callCount, 1)
  const callOptions = got.args[0][1]
  t.deepEqual(callOptions.headers, expectedHeaders)
})

test('should return error when no uri or endpoint', async (t) => {
  const got = sinon.stub().resolves({ statusCode: 200, body: 'key=value' })
  const request = { method: 'GET' }

  const ret = await send(got)(request)

  t.is(ret.status, 'error')
})

test('should return notfound on 404', async (t) => {
  const got = sinon.stub().resolves({
    statusCode: 404,
    statusMessage: 'Response code 404 (Not Found)',
  })
  const request = {
    method: 'GET',
    endpoint: { uri: 'http://form.com/unknown' },
  }

  const ret = await send(got)(request)

  t.is(ret.status, 'notfound')
  t.is(typeof ret.error, 'string')
})

test('should return noaccess on 401', async (t) => {
  const got = sinon.stub().resolves({
    statusCode: 401,
    statusMessage: 'Response code 401 (No Access)',
  })
  const request = {
    method: 'GET',
    endpoint: { uri: 'http://form.com/secured' },
  }

  const ret = await send(got)(request)

  t.is(ret.status, 'noaccess')
  t.is(typeof ret.error, 'string')
})

test('should return error on all other errors', async (t) => {
  const got = sinon.stub().resolves({
    statusCode: 500,
    statusMessage: 'Response code 500 (Server Error)',
  })
  const request = {
    method: 'GET',
    endpoint: { uri: 'http://form.com/error' },
  }

  const ret = await send(got)(request)

  t.is(ret.status, 'error')
  t.is(typeof ret.error, 'string')
})
