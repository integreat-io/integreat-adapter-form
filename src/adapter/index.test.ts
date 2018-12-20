import test from 'ava'

import adapter from '.'

test('should be an Integreat adapter', (t) => {
  t.truthy(adapter)
  t.is(typeof adapter.prepareEndpoint, 'function')
  t.is(typeof adapter.send, 'function')
  t.is(typeof adapter.normalize, 'function')
  t.is(typeof adapter.serialize, 'function')
  t.is(typeof adapter.connect, 'function')
  t.is(typeof adapter.disconnect, 'function')
})

test('should have minimal prepareEndpoint implementation', (t) => {
  const endpointOptions = { uri: 'https://somewhere.com' }

  const ret = adapter.prepareEndpoint(endpointOptions)

  t.truthy(ret)
  t.is(ret.uri, 'https://somewhere.com')
})

test('should return null as connection', async (t) => {
  const ret = await adapter.connect({}, {}, null)

  t.is(ret, null)
})

test('should have minimal serialize implementation', async (t) => {
  const request = { action: {}, endpoint: { uri: '' } }

  const ret = await adapter.serialize(request)

  t.is(ret, request)
})

test('should have minimal normalize implementation', async (t) => {
  const response = {}
  const request = { action: {}, endpoint: { uri: '' } }

  const ret = await adapter.normalize(response, request)

  t.is(ret, response)
})

test('should do nothing when callling disconnect', async (t) => {
  const ret = await adapter.disconnect(null)

  t.is(ret, undefined)
})
