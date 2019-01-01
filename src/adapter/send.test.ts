import test from 'ava'
import sinon = require('sinon')

import send, { HttpError } from './send'

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
  t.is(callOptions.method, 'GET'),
  t.deepEqual(callOptions.headers, {})
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
  const expectedHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  const ret = await send(got)(request)

  t.deepEqual(ret, expected)
  t.is(got.callCount, 1)
  t.is(got.args[0][0], 'http://form.com/theform')
  const callOptions = got.args[0][1]
  t.is(callOptions.method, 'POST')
  t.deepEqual(callOptions.headers, expectedHeaders)
})

test('should return error when no uri or endpoint', async (t) => {
  const got = sinon.stub().resolves({ body: 'key=value' })
  const request = { method: 'QUERY' }

  const ret = await send(got)(request)

  t.is(ret.status, 'error')
})

test('should return notfound on 404', async (t) => {
  const notFoundError = new Error('Response code 404 (Not Found)') as HttpError
  notFoundError.statusCode = 404
  const got = sinon.stub().rejects(notFoundError)
  const request = {
    method: 'QUERY',
    endpoint: { uri: 'http://form.com/unknown' }
  }

  const ret = await send(got)(request)

  t.is(ret.status, 'notfound')
  t.is(typeof ret.error, 'string')
})

test('should return noaccess on 401', async (t) => {
  const noAccessError = new Error('Response code 401 (No Access)') as HttpError
  noAccessError.statusCode = 401
  const got = sinon.stub().rejects(noAccessError)
  const request = {
    method: 'QUERY',
    endpoint: { uri: 'http://form.com/secured' }
  }

  const ret = await send(got)(request)

  t.is(ret.status, 'noaccess')
  t.is(typeof ret.error, 'string')
})

test('should return error on all other errors', async (t) => {
  const noAccessError = new Error('Response code 500 (Server Error)') as HttpError
  noAccessError.statusCode = 500
  const got = sinon.stub().rejects(noAccessError)
  const request = {
    method: 'QUERY',
    endpoint: { uri: 'http://form.com/error' }
  }

  const ret = await send(got)(request)

  t.is(ret.status, 'error')
  t.is(typeof ret.error, 'string')
})
