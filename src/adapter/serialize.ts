/* eslint-disable security/detect-object-injection */
import { Request, RequestData, DataProperty } from '.'

interface Dictionary {
  [key: string]: string | number | null | undefined
}

const formatObject = (value?: DataProperty | null) =>
  typeof value === 'object' ? JSON.stringify(value) : String(value)
const formatValue = (value?: DataProperty | null) =>
  encodeURIComponent(formatObject(value)).replace(/%20/g, '+')

const isDictionary = (data?: RequestData): data is Dictionary =>
  !!data && typeof data === 'object'

const serializeData = (data?: RequestData) =>
  isDictionary(data)
    ? Object.keys(data)
        .map((key: string) =>
          typeof data[key] === 'undefined'
            ? key
            : `${key}=${formatValue(data[key])}`
        )
        .join('&')
    : null

export default async function serialize(request: Request): Promise<Request> {
  return {
    ...request,
    data: serializeData(
      Array.isArray(request.data) ? request.data[0] : request.data
    ),
  }
}
