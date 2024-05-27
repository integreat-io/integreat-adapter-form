import mapAny from 'map-any'
import parseFormData from './utils/parseFormData.js'
import stringifyFormData from './utils/stringifyFormData.js'
import type { Transformer } from 'integreat'

const transformer: Transformer = () => () =>
  function transformer(data, state) {
    return mapAny(
      (data) => (state.rev ? stringifyFormData(data) : parseFormData(data)),
      data,
    )
  }

export default transformer
