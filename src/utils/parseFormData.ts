const parseObject = (value: string) => {
  try {
    return JSON.parse(value)
  } catch (err) {
    return value
  }
}

export default function parseFormData(data: unknown) {
  if (typeof data === 'string') {
    return data
      .split('&')
      .map((pair) => pair.split('='))
      .map(([key, value]) => ({
        [key]:
          typeof value === 'undefined'
            ? undefined
            : parseObject(decodeURIComponent(value).replace(/\+/g, ' ')),
      }))
      .reduce((object, pair) => ({ ...object, ...pair }), {})
  } else {
    return undefined
  }
}
