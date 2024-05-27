import test from 'ava'

import stringifyFormData from './stringifyFormData.js'

// Tests

test('should serialize simple data object', (t) => {
  const data = {
    value: 1,
    text: 'Several words here',
  }
  const expected = 'value=1&text=Several+words+here'

  const ret = stringifyFormData(data)

  t.is(ret, expected)
})

test('should serialize uri', (t) => {
  const data = {
    value: 1,
    redirect_uri: 'http://redirect.com/to/this.html',
  }
  const expected =
    'value=1&redirect_uri=http%3A%2F%2Fredirect.com%2Fto%2Fthis.html'

  const ret = stringifyFormData(data)

  t.is(ret, expected)
})

test('should serialize object', (t) => {
  const data = {
    value: 1,
    object: { id: 'ent1', type: 'entry' },
  }
  const expected =
    'value=1&object=%7B%22id%22%3A%22ent1%22%2C%22type%22%3A%22entry%22%7D'

  const ret = stringifyFormData(data)

  t.is(ret, expected)
})

test('should serialize object with one key', (t) => {
  const data = {
    text: 'Several words here',
  }
  const expected = 'text=Several+words+here'

  const ret = stringifyFormData(data)

  t.is(ret, expected)
})

test('should serialize keys with empty values', (t) => {
  const data = {
    none: undefined,
    nil: null,
    empty: '',
    zero: 0,
  }
  const expected = 'none&nil=null&empty=&zero=0'

  const ret = stringifyFormData(data)

  t.is(ret, expected)
})

test('should return undefined when not an object', (t) => {
  const data = null
  const expected = undefined

  const ret = stringifyFormData(data)

  t.is(ret, expected)
})
