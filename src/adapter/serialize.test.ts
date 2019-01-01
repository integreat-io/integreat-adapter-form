import test from 'ava'

import serialize from './serialize'

test('should serialize simple data object', async (t) => {
  const request = {
    method: 'MUTATION',
    data: {
      value: 1,
      text: 'Several words here'
    }
  }
  const expectedData = 'value=1&text=Several+words+here'

  const ret = await serialize(request)

  t.is(ret.data, expectedData)
})

test('should serialize uri', async (t) => {
  const request = {
    method: 'MUTATION',
    data: {
      value: 1,
      redirect_uri: 'http://redirect.com/to/this.html'
    }
  }
  const expectedData = 'value=1&redirect_uri=http%3A%2F%2Fredirect.com%2Fto%2Fthis.html'

  const ret = await serialize(request)

  t.is(ret.data, expectedData)
})

test('should serialize object', async (t) => {
  const request = {
    method: 'MUTATION',
    data: {
      value: 1,
      object: { id: 'ent1', type: 'entry' }
    }
  }
  const expectedData = 'value=1&object=%7B%22id%22%3A%22ent1%22%2C%22type%22%3A%22entry%22%7D'

  const ret = await serialize(request)

  t.is(ret.data, expectedData)
})

test('should serialize object with one key', async (t) => {
  const request = {
    method: 'MUTATION',
    data: {
      text: 'Several words here'
    }
  }
  const expectedData = 'text=Several+words+here'

  const ret = await serialize(request)

  t.is(ret.data, expectedData)
})

test('should serialize first object in array', async (t) => {
  const request = {
    method: 'MUTATION',
    data: [{ value: 1 }, { value: 2 }]
  }
  const expectedData = 'value=1'

  const ret = await serialize(request)

  t.is(ret.data, expectedData)
})

test('should serialize keys with empty values', async (t) => {
  const request = {
    method: 'MUTATION',
    data: {
      none: undefined,
      nil: null,
      empty: '',
      zero: 0
    }
  }
  const expectedData = 'none&nil=null&empty=&zero=0'

  const ret = await serialize(request)

  t.is(ret.data, expectedData)
})

test('should return null when not an object', async (t) => {
  const request = {
    method: 'MUTATION',
    data: null
  }
  const expectedData = null

  const ret = await serialize(request)

  t.deepEqual(ret.data, expectedData)
})
