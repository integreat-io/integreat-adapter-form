# application/x-www-form-urlencoded adapter for Integreat

Adapter that lets
[Integreat](https://github.com/integreat-io/integreat) send and receive content
in application/x-www-form-urlencoded encoding.

[![npm Version](https://img.shields.io/npm/v/integreat-adapter-form.svg)](https://www.npmjs.com/package/integreat-adapter-form)
[![Maintainability](https://api.codeclimate.com/v1/badges/6331723a6ff61de5f232/maintainability)](https://codeclimate.com/github/integreat-io/integreat-adapter-form/maintainability)

## Getting started

### Prerequisits

Requires node v18 and Integreat v1.0.

### Installing and using

Install from npm:

```
npm install integreat-adapter-form
```

Example of use:

```javascript
import Integreat from 'integreat'
import httpTransporter from 'integreat-transporter-http'
import formAdapter from 'integreat-adapter-form'
import defs from './config.js'

const great = Integreat.create(defs, {
  transporters: { http: httpTransporter },
  adapters: { form: formAdapter },
})

// ... and then dispatch actions as usual
```

Example service configuration:

```javascript
{
  id: 'store',
  transporter: 'http',
  adapters: ['form'],
  options: {
    includeHeaders: true
  },
  endpoints: [
    { options: { uri: 'https://api.com/formDataEndpoint' } }
  ]
}
```

Data in payload and response will be application/x-www-form-urlencoded encoded
[as described in the W3C Forms specification](https://www.w3.org/TR/html401/interact/forms.html#didx-applicationx-www-form-urlencoded)
when sending _to_ a service, and decoded back to JS data coming _from_ a
service.

The adapter has no options.

### Form transformer

The package also includes a transformer, that works exactly like the adapter,
except it is intended for use in mutation pipelines with
`{ $transform: 'form' }`. You may use it like this:

Example of use:

```javascript
import integreat from 'integreat'
import httpTransporter from 'integreat-transporter-http'
import formTransformer from 'integreat-adapter-form/transformer.js'
import defs from './config.js'

const great = Integreat.create(defs, {
  transporters: { http: httpTransporter },
  transformers: { form: formTransformer },
})

// In a mutation pipeline:

const mutation = ['response.data', { $transform: 'form' }]
```

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
