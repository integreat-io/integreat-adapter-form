import test from 'node:test'
import assert from 'node:assert/strict'

import transformer from './transformer.js'

// Setup

const operands = {}
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

  const ret = transformer(operands)(options)(data, state)

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

  const ret = transformer(operands)(options)(data, state)

  assert.deepEqual(ret, expected)
})

test('should return undefined when data is not a string', () => {
  const data = {
    value: 1,
    text: 'Several words here',
  }
  const expected = undefined

  const ret = transformer(operands)(options)(data, state)

  assert.equal(ret, expected)
})

// Tests -- to service

test('should stringify as form to a service', () => {
  const data = {
    value: 1,
    text: 'Several words here',
  }
  const expected = 'value=1&text=Several+words+here'

  const ret = transformer(operands)(options)(data, stateRev)

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

  const ret = transformer(operands)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})

test('should return undefined when data is not an object', () => {
  const data = 'Not an object'
  const expected = undefined

  const ret = transformer(operands)(options)(data, stateRev)

  assert.deepEqual(ret, expected)
})
