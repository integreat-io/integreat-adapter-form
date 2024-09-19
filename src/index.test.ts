import test from 'node:test'
import assert from 'node:assert/strict'

import adapter from './index.js'

// Setup

const options = {}

// Tests

test('should be an Integreat adapter', () => {
  assert(adapter)
  assert.equal(typeof adapter.prepareOptions, 'function')
  assert.equal(typeof adapter.normalize, 'function')
  assert.equal(typeof adapter.serialize, 'function')
})

// Tests -- prepareOptions

test('should prepare options', () => {
  const options = { setStructureInKeys: true }
  const serviceId = 'entries'
  const expected = { setStructureInKeys: true }

  const ret = adapter.prepareOptions(options, serviceId)

  assert.deepEqual(ret, expected)
})

test('should remove unknown options', () => {
  const options = { dontKnow: 'whatthisis' }
  const serviceId = 'entries'
  const expected = { setStructureInKeys: false }

  const ret = adapter.prepareOptions(options, serviceId)

  assert.deepEqual(ret, expected)
})

// Tests -- normalize

test('should normalize payload data', async () => {
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

  assert.deepEqual(ret, expected)
})

test('should normalize response data', async () => {
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

  assert.deepEqual(ret, expected)
})

test('should normalize form data serialized with setStructureInKeys', async () => {
  const options = { setStructureInKeys: true } // We normalize this kind of data regardless of this flag, but it will often be set in these cases
  const action = {
    type: 'SET',
    payload: {
      type: 'entry',
      data: 'items[0][value]=1&items[0][text]=Several+words+here&items[1][value]=2&items[1][text]=More+words+here',
    },
    meta: { ident: { id: 'johnf' } },
  }
  const expected = {
    type: 'SET',
    payload: {
      type: 'entry',
      data: {
        items: [
          { value: 1, text: 'Several words here' },
          { value: 2, text: 'More words here' },
        ],
      },
    },
    meta: { ident: { id: 'johnf' } },
  }

  const ret = await adapter.normalize(action, options)

  assert.deepEqual(ret, expected)
})

// Tests -- serialize

test('should serialize payload', async () => {
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

  assert.deepEqual(ret, expected)
})

test('should serialize response', async () => {
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

  assert.deepEqual(ret, expected)
})

test('should serialize first item when data is an array', async () => {
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

  assert.deepEqual(ret, expected)
})

test('should serialize when setStructureInKeys is true', async () => {
  const options = { setStructureInKeys: true }
  const action = {
    type: 'SET',
    payload: {
      type: 'entry',
      data: {
        items: [
          { value: 1, text: 'Several words here' },
          { value: 2, text: 'More words here' },
        ],
      },
    },
    meta: { ident: { id: 'johnf' } },
  }
  const expected = {
    type: 'SET',
    payload: {
      type: 'entry',
      data: 'items[0][value]=1&items[0][text]=Several+words+here&items[1][value]=2&items[1][text]=More+words+here',
    },
    meta: { ident: { id: 'johnf' } },
  }

  const ret = await adapter.serialize(action, options)

  assert.deepEqual(ret, expected)
})
