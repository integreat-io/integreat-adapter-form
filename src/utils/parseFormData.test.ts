import test from 'node:test'
import assert from 'node:assert/strict'

import parseFormData from './parseFormData.js'

// Tests

test('should normalize simple form data', () => {
  const data = 'value=1&text=Several+words+here'
  const expected = {
    value: 1,
    text: 'Several words here',
  }

  const ret = parseFormData(data)

  assert.deepEqual(ret, expected)
})

test('should normalize one pair', () => {
  const data = 'value=1'
  const expected = { value: 1 }

  const ret = parseFormData(data)

  assert.deepEqual(ret, expected)
})

test('should normalize line break', () => {
  const data = 'value=1&text=Several+words%0D%0Ahere%0D%0Aand+here'
  const expected = {
    value: 1,
    text: 'Several words\nhere\nand here',
  }

  const ret = parseFormData(data)

  assert.deepEqual(ret, expected)
})

test('should normalize keys with bracket postfix into array', () => {
  const data = 'value=1&lines[]=Several+words&lines[]=on+several&lines[]=lines'
  const expected = {
    value: 1,
    lines: ['Several words', 'on several', 'lines'],
  }

  const ret = parseFormData(data)

  assert.deepEqual(ret, expected)
})

test('should normalize one key with bracket postfix into array', () => {
  const data = 'value=1&lines[]=Several+words'
  const expected = {
    value: 1,
    lines: ['Several words'],
  }

  const ret = parseFormData(data)

  assert.deepEqual(ret, expected)
})

test('should normalize form data with objects', () => {
  const data =
    'value=1&text=Several+words+here&object=%7B%22id%22%3A%22ent1%22%2C%22type%22%3A%22entry%22%7D'
  const expected = {
    value: 1,
    text: 'Several words here',
    object: { id: 'ent1', type: 'entry' },
  }

  const ret = parseFormData(data)

  assert.deepEqual(ret, expected)
})

test('should normalize keys with structure', () => {
  const data = 'value=1&object[id]=ent1&object[type]=entry'
  const expected = {
    value: 1,
    object: { id: 'ent1', type: 'entry' },
  }

  const ret = parseFormData(data)

  assert.deepEqual(ret, expected)
})

test('should normalize keys with structure with many levels', () => {
  const data =
    'value=1&object[array][0][id]=ent1&object[array][0][type]=entry&object[array][0][tags][0]=news&object[array][0][tags][1]=politics&object[array][1][id]=ent2&object[array][1][type]=entry&object[array][1][tags][0]=sports&empty'
  const expected = {
    value: 1,
    object: {
      array: [
        { id: 'ent1', type: 'entry', tags: ['news', 'politics'] },
        { id: 'ent2', type: 'entry', tags: ['sports'] },
      ],
    },
    empty: undefined,
  }

  const ret = parseFormData(data)

  assert.deepEqual(ret, expected)
})

test('should keep date string as string', () => {
  const data = 'value=1&date=2024-05-11T16%3A43%3A11.000Z'
  const expected = {
    value: 1,
    date: '2024-05-11T16:43:11.000Z',
  }

  const ret = parseFormData(data)

  assert.deepEqual(ret, expected)
})

test('should treat key without value as having undefined value', () => {
  const data = 'key'
  const expected = { key: undefined }

  const ret = parseFormData(data)

  assert.deepEqual(ret, expected)
})

test('should return undefined when not a string', () => {
  const data = null
  const expected = undefined

  const ret = parseFormData(data)

  assert.deepEqual(ret, expected)
})
