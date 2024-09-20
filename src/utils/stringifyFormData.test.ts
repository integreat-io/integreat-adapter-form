import test from 'node:test'
import assert from 'node:assert/strict'

import stringifyFormData from './stringifyFormData.js'

// Tests

test('should serialize simple data object', () => {
  const data = {
    value: 1,
    text: 'Several words here',
  }
  const expected = 'value=1&text=Several+words+here'

  const ret = stringifyFormData(data)

  assert.equal(ret, expected)
})

test('should serialize uri', () => {
  const data = {
    value: 1,
    redirect_uri: 'http://redirect.com/to/this.html',
  }
  const expected =
    'value=1&redirect_uri=http%3A%2F%2Fredirect.com%2Fto%2Fthis.html'

  const ret = stringifyFormData(data)

  assert.equal(ret, expected)
})

test('should serialize line break', () => {
  const data = {
    value: 1,
    text: 'Several words\nhere\nand here',
  }
  const expected = 'value=1&text=Several+words%0D%0Ahere%0D%0Aand+here'

  const ret = stringifyFormData(data)

  assert.equal(ret, expected)
})

test('should serialize carriage return and line break', () => {
  const data = {
    value: 1,
    text: 'Several words\r\nhere\r\nand here',
  }
  const expected = 'value=1&text=Several+words%0D%0Ahere%0D%0Aand+here'

  const ret = stringifyFormData(data)

  assert.equal(ret, expected)
})

test('should serialize array to several keys with bracket postfix', () => {
  const data = {
    value: 1,
    lines: ['Several words', 'on several', 'lines'],
  }
  const expected =
    'value=1&lines[]=Several+words&lines[]=on+several&lines[]=lines'

  const ret = stringifyFormData(data)

  assert.equal(ret, expected)
})

test('should serialize array with one item to key with bracket postfix', () => {
  const data = {
    value: 1,
    lines: ['Several words'],
  }
  const expected = 'value=1&lines[]=Several+words'

  const ret = stringifyFormData(data)

  assert.equal(ret, expected)
})

test('should serialize object', () => {
  const data = {
    value: 1,
    object: { id: 'ent1', type: 'entry' },
  }
  const expected =
    'value=1&object=%7B%22id%22%3A%22ent1%22%2C%22type%22%3A%22entry%22%7D'

  const ret = stringifyFormData(data)

  assert.equal(ret, expected)
})

test('should serialize object when setStructureInKeys is true', () => {
  const setStructureInKeys = true
  const data = {
    value: 1,
    object: { id: 'ent1', type: 'entry' },
  }
  const expected = 'value=1&object[id]=ent1&object[type]=entry'

  const ret = stringifyFormData(data, setStructureInKeys)

  assert.equal(ret, expected)
})

test('should serialize array of objects when setStructureInKeys is true', () => {
  const setStructureInKeys = true
  const data = {
    value: 1,
    array: [
      { id: 'ent1', type: 'entry' },
      { id: 'ent2', type: 'entry' },
    ],
  }
  const expected =
    'value=1&array[0][id]=ent1&array[0][type]=entry&array[1][id]=ent2&array[1][type]=entry'

  const ret = stringifyFormData(data, setStructureInKeys)

  assert.equal(ret, expected)
})

test('should serialize array and objects over several levels when setStructureInKeys is true', () => {
  const setStructureInKeys = true
  const data = {
    value: 1,
    object: {
      array: [
        { id: 'ent1', type: 'entry', tags: ['news', 'politics'] },
        { id: 'ent2', type: 'entry', tags: ['sports'] },
      ],
    },
    empty: undefined,
  }
  const expected =
    'value=1&object[array][0][id]=ent1&object[array][0][type]=entry&object[array][0][tags][0]=news&object[array][0][tags][1]=politics&object[array][1][id]=ent2&object[array][1][type]=entry&object[array][1][tags][0]=sports'

  const ret = stringifyFormData(data, setStructureInKeys)

  assert.equal(ret, expected)
})

test('should serialize object with one key', () => {
  const data = {
    text: 'Several words here',
  }
  const expected = 'text=Several+words+here'

  const ret = stringifyFormData(data)

  assert.equal(ret, expected)
})

test('should serialize keys with empty values', () => {
  const data = {
    none: undefined,
    nil: null,
    empty: '',
    zero: 0,
  }
  const expected = 'nil=null&empty=&zero=0'

  const ret = stringifyFormData(data)

  assert.equal(ret, expected)
})

test('should serialize date', () => {
  const data = {
    value: 1,
    date: new Date('2024-05-11T18:43:11+02:00'),
  }
  const expected = 'value=1&date=2024-05-11T16%3A43%3A11.000Z'

  const ret = stringifyFormData(data)

  assert.equal(ret, expected)
})

test('should return undefined when not an object', () => {
  const data = null
  const expected = undefined

  const ret = stringifyFormData(data)

  assert.equal(ret, expected)
})
