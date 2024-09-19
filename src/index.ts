import parseFormData from './utils/parseFormData.js'
import stringifyFormData from './utils/stringifyFormData.js'
import type { Action, Adapter } from 'integreat'

export interface Options extends Record<string, unknown> {
  setStructureInKeys?: boolean
}

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
  prepareOptions({ setStructureInKeys = false }: Options, _serviceId) {
    return { setStructureInKeys }
  },

  async normalize(action, _options: Options) {
    const payloadData = parseFormData(action.payload.data)
    const responseData = parseFormData(action.response?.data)

    return setActionData(action, payloadData, responseData)
  },

  async serialize(action, { setStructureInKeys }: Options) {
    const payloadData = stringifyFormData(
      firstIfArray(action.payload.data),
      setStructureInKeys,
    )
    const responseData = stringifyFormData(
      firstIfArray(action.response?.data),
      setStructureInKeys,
    )

    return setActionData(action, payloadData, responseData)
  },
}

export default adapter
