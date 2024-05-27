import { isObject, isDate } from './is.js'

const formatObject = (value: unknown) =>
  isObject(value)
    ? JSON.stringify(value)
    : isDate(value)
      ? value.toISOString()
      : String(value)

const formatValue = (value: unknown) =>
  encodeURIComponent(formatObject(value)).replace(/%20/g, '+')

export default function stringifyFormData(data?: unknown) {
  if (isObject(data)) {
    return Object.entries(data)
      .map(([key, value]) =>
        typeof value === 'undefined' ? key : `${key}=${formatValue(value)}`,
      )
      .join('&')
  } else {
    return undefined
  }
}
