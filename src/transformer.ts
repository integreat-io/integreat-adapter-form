import mapAny from 'map-any'
import parseFormData from './utils/parseFormData.js'
import stringifyFormData from './utils/stringifyFormData.js'
import type { Transformer } from 'integreat'

export interface Props {
  setStructureInKeys?: boolean
}

const transformer: Transformer =
  ({ setStructureInKeys = false }: Props) =>
  () =>
    function transformer(data, state) {
      return mapAny(
        (data) =>
          state.rev
            ? stringifyFormData(data, setStructureInKeys)
            : parseFormData(data),
        data,
      )
    }

export default transformer
