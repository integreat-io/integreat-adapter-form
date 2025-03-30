import { isObject } from './is.js'

const parseObject = (value: string) => {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

const fixLineBreak = (value: string) => value.replace(/%0D%0A/g, '%0A')

const parseValue = (value?: string) =>
  typeof value === 'string'
    ? parseObject(decodeURIComponent(fixLineBreak(value)).replace(/\+/g, ' '))
    : ''

function prepareKeyPart(part: string) {
  if (part === ']') {
    return ''
  }
  const num = Number.parseInt(part, 10)
  return Number.isNaN(num)
    ? part.endsWith(']')
      ? part.slice(0, -1)
      : part
    : num
}

function parseKey(key: string): (string | number)[] {
  return key.split('[').map(prepareKeyPart)
}

function ensureArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : value === undefined ? [] : [value]
}

function ensureObject(value: unknown): Record<string, unknown> {
  return isObject(value) ? value : {}
}

/**
 * Set the given `key` in the target array to the value received by traversing
 * the rest of the keys.
 */
function setOnArray(
  target: unknown[],
  key: number | undefined,
  restKeys: (string | number)[],
  value: string | undefined,
): unknown[] {
  const nextTarget =
    typeof key === 'number' ? target[key as keyof typeof target] : undefined
  const nextValue = setOnTarget(nextTarget, restKeys, value)
  if (typeof key === 'number') {
    // eslint-disable-next-line security/detect-object-injection
    target[key] = nextValue
    return target
  } else {
    return [...target, nextValue]
  }
}

/**
 * Set the given `key` on the target object to the value received by traversing
 * the rest of the keys.
 */
function setOnObject(
  target: Record<string, unknown>,
  key: string,
  restKeys: (string | number)[],
  value: string | undefined,
): Record<string, unknown> {
  const nextTarget = target[key as keyof typeof target]
  const nextValue = setOnTarget(nextTarget, restKeys, value)
  return { ...target, [key]: nextValue }
}

/**
 * Set the next key on the target. Determines whether we are setting an object
 * or an array and hands off to the correct method.
 */
function setOnTarget(
  target: unknown,
  keys: (string | number)[],
  value: string | undefined,
) {
  if (keys.length === 0) {
    return value
  }

  const [key, ...restKeys] = keys
  const isArr = key === '' || typeof key === 'number'
  return isArr
    ? setOnArray(
        ensureArray(target),
        key === '' ? undefined : key,
        restKeys,
        value,
      )
    : setOnObject(ensureObject(target), key, restKeys, value)
}

/**
 * Reduce all key/value pairs down to an object.
 */
function reducePair(
  target: unknown,
  [key, value]: [string, string | undefined],
): Record<string, unknown> {
  const [firstKey, ...restKeys] = parseKey(key)
  if (typeof firstKey === 'string') {
    return setOnObject(
      ensureObject(target),
      firstKey,
      restKeys,
      parseValue(value),
    )
  } else {
    return {}
  }
}

/**
 * Split a form data string into keys and values on an object.
 */
export default function parseFormData(
  data: unknown,
): Record<string, unknown> | undefined {
  if (typeof data === 'string') {
    return data
      .split('&')
      .map((pair) => pair.split('=') as [string, string | undefined])
      .reduce(reducePair, undefined)
  } else {
    return undefined
  }
}
