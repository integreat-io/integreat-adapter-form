import test from 'ava'
import * as nock from 'nock'

import adapter from '../adapter'

// Helpers

test.after.always(() => {
  nock.restore()
})

// Tests

test.failing('should get data', async (t) => {
  const formResponse = 'value=1&text=Several+words+here&object=%7B%22id%22%3A%22ent1%22%2C%22type%22%3A%22entry%22%7D'
  nock('http://test.com')
    .get('/form')
    .reply(200, formResponse)
  const action = {
    type: 'GET',
    payload: {
      type: 'entry',
      id: 'ent1'
    }
  }
  const endpoint = {
    uri: 'http://test.com/form'
  }
  const expected = {
    value: 1,
    text: 'Several words here',
    object: { id: 'ent1', type: 'entry' }
  }

  const ret = await adapter.send({ action, endpoint })

  t.deepEqual(ret, expected)
})
