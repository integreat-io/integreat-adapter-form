# application/x-www-form-urlencoded adapter for Integreat

Adapter that lets
[Integreat](https://github.com/integreat-io/integreat) send and receive content
in application/x-www-form-urlencoded encoding.

[![Build Status](https://travis-ci.org/integreat-io/integreat-adapter-form.svg?branch=master)](https://travis-ci.org/integreat-io/integreat-adapter-form)
[![Coverage Status](https://coveralls.io/repos/github/integreat-io/integreat-adapter-form/badge.svg?branch=master)](https://coveralls.io/github/integreat-io/integreat-adapter-form?branch=master)
[![Dependencies Status](https://tidelift.com/badges/github/integreat-io/integreat-adapter-form?style=flat)](https://tidelift.com/repo/github/integreat-io/integreat-adapter-form)

## Getting started

### Prerequisits

Requires node v8.6 and Integreat v0.7.

### Installing and using

Install from npm:

```
npm install integreat-adapter-form
```

Example of use:
```javascript
const integreat = require('integreat')
const formAdapter = require('integreat-adapter-form')
const defs = require('./config')

const resources = formAdapter(integreat.resources())
const great = integreat(defs, resources)

// ... and then dispatch actions as usual
```

The `formAdapter()` function adds the adapter `form` to the resources object,
but you still need to configure your source to use it.

Example source configuration:

```javascript
{
  id: 'store',
  adapter: 'form',
  options: {
    baseUri: 'https://yoursite/with/form'
  },
  endpoints: [
    {options: {uri: '/the-form'}}
  ]
}
```

Data will be sent with application/x-www-form-urlencoded encoding [as described
in the W3C Forms specification]](https://www.w3.org/TR/html401/interact/forms.html#didx-applicationx-www-form-urlencoded).

### Running the tests

The tests can be run with `npm test`.

## Contributing

Please read
[CONTRIBUTING](https://github.com/integreat-io/integreat-adapter-form/blob/master/CONTRIBUTING.md)
for details on our code of conduct, and the process for submitting pull
requests.

## License

This project is licensed under the ISC License - see the
[LICENSE](https://github.com/integreat-io/integreat-adapter-form/blob/master/LICENSE)
file for details.
