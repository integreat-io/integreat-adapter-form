import { isObject, isDate } from './is.js'

const formatObject = (value: unknown) =>
  isObject(value)
    ? JSON.stringify(value)
    : isDate(value)
      ? value.toISOString()
      : String(value)

const fixLineBreak = (value: unknown) =>
  typeof value === 'string' ? value.replace(/(^|[^\r])\n/g, '$1\r\n') : value

const formatValue = (value: unknown) =>
  encodeURIComponent(formatObject(fixLineBreak(value))).replace(/%20/g, '+')

const formatKeyValue = (key: string, value: unknown) =>
  value === undefined ? key : `${key}=${formatValue(value)}`

function moveStructureToKeys([key, value]: [string, unknown]):
  | string
  | string[] {
  if (Array.isArray(value) || isObject(value)) {
    return Object.entries(value).flatMap(([k, v]) =>
      moveStructureToKeys([`${key}[${k}]`, v]),
    )
  } else {
    return formatKeyValue(key, value)
  }
}

function mapEntry([key, value]: [string, unknown]) {
  if (Array.isArray(value)) {
    // Return one key (with bracket postfix) for each value in an array
    return value.map((val) => formatKeyValue(`${key}[]`, val))
  } else {
    // Format a single value
    return formatKeyValue(key, value)
  }
}

export default function stringifyFormData(
  data?: unknown,
  setStructureInKeys = false,
) {
  if (isObject(data)) {
    const fn = setStructureInKeys ? moveStructureToKeys : mapEntry
    return Object.entries(data).flatMap(fn).join('&')
  } else {
    return undefined
  }
}
