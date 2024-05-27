import test from 'ava'

import adapter from './index.js'

// Setup

const options = {}

// Tests

test('should be an Integreat adapter', (t) => {
  t.truthy(adapter)
  t.is(typeof adapter.prepareOptions, 'function')
  t.is(typeof adapter.normalize, 'function')
  t.is(typeof adapter.serialize, 'function')
})

// Tests -- prepareOptions

test('should prepare options', (t) => {
  const options = { dontKnow: 'whatthisis' }
  const serviceId = 'entries'
  const expected = {}

  const ret = adapter.prepareOptions(options, serviceId)

  t.deepEqual(ret, expected)
})

// Tests -- normalize

test('should normalize payload data', async (t) => {
  const action = {
    type: 'SET',
    payload: { type: 'entry', data: 'value=1&text=Several+words+here' },
    meta: { ident: { id: 'johnf' } },
  }
  const expected = {
    type: 'SET',
    payload: {
      type: 'entry',
      data: {
        value: 1,
        text: 'Several words here',
      },
    },
    meta: { ident: { id: 'johnf' } },
  }

  const ret = await adapter.normalize(action, options)

  t.deepEqual(ret, expected)
})

test('should normalize response data', async (t) => {
  const action = {
    type: 'GET',
    payload: { type: 'entry' },
    response: {
      status: 'ok',
      data: 'value=1&text=Several+words+here',
    },
    meta: { ident: { id: 'johnf' } },
  }
  const expected = {
    type: 'GET',
    payload: { type: 'entry' },
    response: {
      status: 'ok',
      data: {
        value: 1,
        text: 'Several words here',
      },
    },
    meta: { ident: { id: 'johnf' } },
  }

  const ret = await adapter.normalize(action, options)

  t.deepEqual(ret, expected)
})

// Tests -- serialize

test('should serialize payload', async (t) => {
  const action = {
    type: 'SET',
    payload: {
      type: 'entry',
      data: { value: 1, text: 'Several words here' },
    },
    meta: { ident: { id: 'johnf' } },
  }
  const expected = {
    type: 'SET',
    payload: { type: 'entry', data: 'value=1&text=Several+words+here' },
    meta: { ident: { id: 'johnf' } },
  }

  const ret = await adapter.serialize(action, options)

  t.deepEqual(ret, expected)
})

test('should serialize response', async (t) => {
  const action = {
    type: 'SET',
    payload: { type: 'entry' },
    response: {
      status: 'ok',
      data: { value: 1, text: 'Several words here' },
    },
    meta: { ident: { id: 'johnf' } },
  }
  const expected = {
    type: 'SET',
    payload: { type: 'entry' },
    response: { status: 'ok', data: 'value=1&text=Several+words+here' },
    meta: { ident: { id: 'johnf' } },
  }

  const ret = await adapter.serialize(action, options)

  t.deepEqual(ret, expected)
})

test('should serialize first item when data is an array', async (t) => {
  const action = {
    type: 'SET',
    payload: {
      type: 'entry',
      data: [
        { value: 1, text: 'Several words here' },
        { value: 2, text: 'More words here' },
      ],
    },
    response: {
      status: 'ok',
      data: [
        { value: 3, text: 'Even more words here' },
        { value: 4, text: 'And some more ...' },
      ],
    },
    meta: { ident: { id: 'johnf' } },
  }
  const expected = {
    type: 'SET',
    payload: { type: 'entry', data: 'value=1&text=Several+words+here' },
    response: { status: 'ok', data: 'value=3&text=Even+more+words+here' },
    meta: { ident: { id: 'johnf' } },
  }

  const ret = await adapter.serialize(action, options)

  t.deepEqual(ret, expected)
})
