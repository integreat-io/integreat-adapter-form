# application/x-www-form-urlencoded adapter for Integreat

Adapter that lets
[Integreat](https://github.com/integreat-io/integreat) send and receive content
in application/x-www-form-urlencoded encoding.

[![npm Version](https://img.shields.io/npm/v/integreat-adapter-form.svg)](https://www.npmjs.com/package/integreat-adapter-form)
[![Build Status](https://travis-ci.org/integreat-io/integreat-adapter-form.svg?branch=master)](https://travis-ci.org/integreat-io/integreat-adapter-form)
[![Coverage Status](https://coveralls.io/repos/github/integreat-io/integreat-adapter-form/badge.svg?branch=master)](https://coveralls.io/github/integreat-io/integreat-adapter-form?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/6331723a6ff61de5f232/maintainability)](https://codeclimate.com/github/integreat-io/integreat-adapter-form/maintainability)

## Getting started

### Prerequisits

Requires node v10 and Integreat v0.7.

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

const resources = integreat.resources(formAdapter)
const great = integreat(defs, resources)

// ... and then dispatch actions as usual
```

Example source configuration:

```javascript
{
  id: 'store',
  adapter: 'form',
  endpoints: [
    { options: { uri: 'https://api.com/accepting/form' } }
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
