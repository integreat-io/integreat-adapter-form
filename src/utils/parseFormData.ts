import { isObject } from './is.js'

const parseObject = (value: string) => {
  try {
    return JSON.parse(value)
  } catch (err) {
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

function setOnTarget(
  target: unknown,
  keys: (string | number)[],
  value: string | undefined,
) {
  const [key, ...restKeys] = keys
  const isArr = key === '' || typeof key === 'number'
  const currentTarget = isArr ? ensureArray(target) : ensureObject(target)
  const nextTarget =
    key === '' ? undefined : currentTarget[key as keyof typeof currentTarget]
  const nextValue =
    restKeys.length === 0 ? value : setOnTarget(nextTarget, restKeys, value)
  if (key === '') {
    ;(currentTarget as unknown[]).push(nextValue)
  } else {
    ;(currentTarget as unknown[])[key as number] = nextValue // This handles both arrays and object, but we have forced the typing to array, just to satisfy TS without writing extra logic.
  }
  return currentTarget
}

function reducePair(
  target: unknown,
  [key, value]: [string, string | undefined],
): unknown[] | Record<string, unknown> {
  const keys = parseKey(key)
  return setOnTarget(target, keys, parseValue(value))
}

export default function parseFormData(data: unknown) {
  if (typeof data === 'string') {
    return data
      .split('&')
      .map((pair) => pair.split('=') as [string, string | undefined])
      .reduce(reducePair, undefined)
  } else {
    return undefined
  }
}
