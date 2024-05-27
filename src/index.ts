import parseFormData from './utils/parseFormData.js'
import stringifyFormData from './utils/stringifyFormData.js'
import type { Action, Adapter } from 'integreat'

const firstIfArray = (data: unknown) => (Array.isArray(data) ? data[0] : data)

const setActionData = (
  action: Action,
  payloadData: unknown,
  responseData: unknown,
) => ({
  ...action,
  payload: {
    ...action.payload,
    ...(payloadData === undefined ? {} : { data: payloadData }),
  },
  ...(action.response && {
    response: {
      ...action.response,
      ...(responseData === undefined ? {} : { data: responseData }),
    },
  }),
})

const adapter: Adapter = {
  prepareOptions(_options, _serviceId) {
    return {}
  },

  async normalize(action, _options) {
    const payloadData = parseFormData(action.payload.data)
    const responseData = parseFormData(action.response?.data)

    return setActionData(action, payloadData, responseData)
  },

  async serialize(action, _options) {
    const payloadData = stringifyFormData(firstIfArray(action.payload.data))
    const responseData = stringifyFormData(firstIfArray(action.response?.data))

    return setActionData(action, payloadData, responseData)
  },
}

export default adapter
