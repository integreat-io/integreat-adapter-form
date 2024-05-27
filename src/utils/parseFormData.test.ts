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

test('should normalize keys with bracket postfix into array', (t) => {
  const data = 'value=1&lines[]=Several+words&lines[]=on+several&lines[]=lines'
  const expected = {
    value: 1,
    lines: ['Several words', 'on several', 'lines'],
  }

  const ret = parseFormData(data)

  t.deepEqual(ret, expected)
})

test('should normalize one key with bracket postfix into array', (t) => {
  const data = 'value=1&lines[]=Several+words'
  const expected = {
    value: 1,
    lines: ['Several words'],
  }

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

test('should keep date string as string', (t) => {
  const data = 'value=1&date=2024-05-11T16%3A43%3A11.000Z'
  const expected = {
    value: 1,
    date: '2024-05-11T16:43:11.000Z',
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
