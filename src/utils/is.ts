const OK_STATUSES = ['ok', 'noaction', 'queued']

export const isObject = (value: unknown): value is Record<string, unknown> =>
  Object.prototype.toString.call(value) === '[object Object]'

export const isDate = (value: unknown): value is Date =>
  Object.prototype.toString.call(value) === '[object Date]'

export const isErrorStatus = (status?: string) =>
  typeof status === 'string' && !OK_STATUSES.includes(status)
