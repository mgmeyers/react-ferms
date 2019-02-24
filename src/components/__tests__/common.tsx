import FormFields from 'data/FormFields'
import { noop } from 'helpers'

export const defaultCtx = {
  add: noop,
  fields: new FormFields({}),
  remove: noop,
  setTransform: noop,
  setValidateOn: noop,
  setValidation: noop,
  setValue: noop,
  validateField: noop,
}
