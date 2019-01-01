import { Response, Request } from '.'

const parseObject = (value: string) => {
  try {
    return JSON.parse(value)
  } catch (err) {
    return value
  }
}

const parseForm = (form: string) => (typeof form === 'string')
  ? form.split('&')
      .map((pair) => pair.split('='))
      .map(([key, value]) => ({ [key]: (typeof value === 'undefined') ? undefined : parseObject(decodeURIComponent(value).replace(/\+/g, ' ')) }))
      .reduce((object, pair) => ({ ...object, ...pair }), {})
  : null

export default async function normalize (response: Response, _request: Request) {
  return {
    ...response,
    data: parseForm(response.data)
  }
}
