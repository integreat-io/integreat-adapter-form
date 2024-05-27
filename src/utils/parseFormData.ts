const parseObject = (value: string) => {
  try {
    return JSON.parse(value)
  } catch (err) {
    return value
  }
}

const parseValue = (value?: string) =>
  typeof value === 'string'
    ? parseObject(decodeURIComponent(value).replace(/\+/g, ' '))
    : undefined

function reducePair(
  obj: Record<string, unknown>,
  [key, value]: [string, string | undefined],
) {
  if (key.endsWith('[]')) {
    // When key ends in brackets, we have an array. This may be one of several
    // keys with items for the array, so combine them.
    const actualKey = key.slice(0, key.length - 2)
    const existingValue = obj[actualKey] // eslint-disable-line security/detect-object-injection
    const existingArray = Array.isArray(existingValue) ? existingValue : []
    return { ...obj, [actualKey]: [...existingArray, parseValue(value)] }
  } else {
    // Parse a single value.
    return { ...obj, [key]: parseValue(value) }
  }
}

export default function parseFormData(data: unknown) {
  if (typeof data === 'string') {
    return data
      .split('&')
      .map((pair) => pair.split('=') as [string, string | undefined])
      .reduce(reducePair, {})
  } else {
    return undefined
  }
}
