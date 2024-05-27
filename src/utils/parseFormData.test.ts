import test from 'ava'

import parseFormData from './parseFormData.js'

// Tests

test('should normalize simple form data', (t) => {
  const data = 'value=1&text=Several+words+here'
  const expected = {
    value: 1,
    text: 'Several words here',
  }

  const ret = parseFormData(data)

  t.deepEqual(ret, expected)
})

test('should normalize one pair', (t) => {
  const data = 'value=1'
  const expected = { value: 1 }

  const ret = parseFormData(data)

  t.deepEqual(ret, expected)
})

test('should normalize form data with objects', (t) => {
  const data =
    'value=1&text=Several+words+here&object=%7B%22id%22%3A%22ent1%22%2C%22type%22%3A%22entry%22%7D'
  const expected = {
    value: 1,
    text: 'Several words here',
    object: { id: 'ent1', type: 'entry' },
  }

  const ret = parseFormData(data)

  t.deepEqual(ret, expected)
})

test('should treat key without value as having undefined value', (t) => {
  const data = 'key'
  const expected = { key: undefined }

  const ret = parseFormData(data)

  t.deepEqual(ret, expected)
})

test('should return undefined when not a string', (t) => {
  const data = null
  const expected = undefined

  const ret = parseFormData(data)

  t.deepEqual(ret, expected)
})
