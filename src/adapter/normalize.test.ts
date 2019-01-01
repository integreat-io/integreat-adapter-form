import test from 'ava'

import normalize from './normalize'

// Setup

const request = {
  method: 'QUERY',
  data: null
}

// Tests

test('should normalize simple form data', async (t) => {
  const response = {
    status: 'ok',
    data: 'value=1&text=Several+words+here'
  }
  const expected = {
    value: 1,
    text: 'Several words here'
  }

  const ret = await normalize(response, request)

  t.deepEqual(ret.data, expected)
})

test('should normalize one pair', async (t) => {
  const response = {
    status: 'ok',
    data: 'value=1'
  }
  const expected = {
    value: 1
  }

  const ret = await normalize(response, request)

  t.deepEqual(ret.data, expected)
})

test('should normalize form data with objects', async (t) => {
  const response = {
    status: 'ok',
    data: 'value=1&text=Several+words+here&object=%7B%22id%22%3A%22ent1%22%2C%22type%22%3A%22entry%22%7D'
  }
  const expected = {
    value: 1,
    text: 'Several words here',
    object: { id: 'ent1', type: 'entry' }
  }

  const ret = await normalize(response, request)

  t.deepEqual(ret.data, expected)
})

test('should treat key without value as having undefined value', async (t) => {
  const response = {
    status: 'ok',
    data: 'key'
  }
  const expected = {
    key: undefined
  }

  const ret = await normalize(response, request)

  t.deepEqual(ret.data, expected)
})

test('should return null when not a string', async (t) => {
  const response = {
    status: 'ok',
    data: null
  }
  const expected = null

  const ret = await normalize(response, request)

  t.deepEqual(ret.data, expected)
})
