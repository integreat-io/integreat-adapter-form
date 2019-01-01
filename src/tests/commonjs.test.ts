import test from 'ava'

import resources = require('..')

test('should have resources', (t) => {
  t.truthy(resources)
  t.truthy(resources.adapters)
  t.truthy(resources.adapters.form)
})
