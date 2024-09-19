import test from 'node:test'
import assert from 'node:assert/strict'

import transformer from './transformer.js'

// Setup

const props = {}
const options = {}
const state = {
  rev: false,
  onlyMappedValues: false,
  context: [],
  value: {},
}
const stateRev = {
  rev: true,
  onlyMappedValues: false,
  context: [],
  value: {},
}

// Tests -- from service

test('should parse as form from a service', () => {
  const data = 'value=1&text=Several+words+here'
  const expected = {
    value: 1,
    text: 'Several words here',
  }

  const ret = transformer(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should parse an array of form data from a service', () => {
  const data = [
    'value=1&text=Several+words+here',
    'value=2&text=And+even+more+here',
  ]
  const expected = [
    {
      value: 1,
      text: 'Several words here',
    },
    {
      value: 2,
      text: 'And even more here',
    },
  ]

  const ret = transformer(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should return undefined when data is not a string', () => {
  const data = {
    value: 1,
    text: 'Several words here',
  }
  const expected = undefined

  const ret = transformer(props)(options)(data, state)

  assert.equal(ret, expected)
})

test('should normalize form data serialized with setStructureInKeys', async () => {
  const props = { setStructureInKeys: true } // We normalize this kind of data regardless of this flag, but it will often be set in these cases
  const data =
    'items[0][value]=1&items[0][text]=Several+words+here&items[1][value]=2&items[1][text]=More+words+here'
  const expected = {
    items: [
      { value: 1, text: 'Several words here' },
      { value: 2, text: 'More words here' },
    ],
  }

  const ret = transformer(props)(options)(data, state)

  assert.deepEqual(ret, expected)
})

// Tests -- to service

test('should stringify as form to a service', () => {
  const data = {
    value: 1,
    text: 'Several words here',
  }
  const expected = 'value=1&text=Several+words+here'

  const ret = transformer(props)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should stringify an array of to a service', () => {
  const data = [
    {
      value: 1,
      text: 'Several words here',
    },
    {
      value: 2,
      text: 'And even more here',
    },
  ]
  const expected = [
    'value=1&text=Several+words+here',
    'value=2&text=And+even+more+here',
  ]

  const ret = transformer(props)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should serialize when setStructureInKeys is true', async () => {
  const props = { setStructureInKeys: true }
  const data = {
    items: [
      { value: 1, text: 'Several words here' },
      { value: 2, text: 'More words here' },
    ],
  }
  const expected =
    'items[0][value]=1&items[0][text]=Several+words+here&items[1][value]=2&items[1][text]=More+words+here'

  const ret = transformer(props)(options)(data, stateRev)

  assert.equal(ret, expected)
})

test('should return undefined when data is not an object', () => {
  const data = 'Not an object'
  const expected = undefined

  const ret = transformer(props)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})
