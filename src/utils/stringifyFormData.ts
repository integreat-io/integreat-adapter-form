import { isObject, isDate } from './is.js'

const formatObject = (value: unknown) =>
  isObject(value)
    ? JSON.stringify(value)
    : isDate(value)
      ? value.toISOString()
      : String(value)

const formatValue = (value: unknown) =>
  encodeURIComponent(formatObject(value)).replace(/%20/g, '+')

function mapEntry([key, value]: [string, unknown]) {
  if (Array.isArray(value)) {
    // Return one key (with bracket postfix) for each value in an array
    return value.map((val) => `${key}[]=${formatValue(val)}`)
  } else {
    // Format a single value
    return value === undefined ? key : `${key}=${formatValue(value)}`
  }
}

export default function stringifyFormData(data?: unknown) {
  if (isObject(data)) {
    return Object.entries(data).flatMap(mapEntry).join('&')
  } else {
    return undefined
  }
}
