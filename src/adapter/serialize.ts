import { Request, RequestData } from '.'

interface Dictionary {
  [key: string]: string | number | null | undefined
}

const formatObject = (value: object) => (typeof value === 'object')
  ? JSON.stringify(value)
  : value
const formatValue = (value: any) => encodeURIComponent(formatObject(value)).replace(/%20/g, '+')

const isDictionary = (data?: RequestData): data is Dictionary =>
  (!!data && typeof data === 'object')

const serializeData = (data?: RequestData) => isDictionary(data)
  ? Object.keys(data)
    .map((key: string) => (typeof data[key] === 'undefined') ? key : `${key}=${formatValue(data[key])}`)
    .join('&')
  : null

export default async function serialize (request: Request) {
  return {
    ...request,
    data: serializeData((Array.isArray(request.data)) ? request.data[0] : request.data)
  }
}
