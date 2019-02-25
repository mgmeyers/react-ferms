import FormFields from 'data/FormFields'
import defaultStrat from 'validation-strategies/default'

import { noop } from 'helpers'
import { FormFieldJSON } from 'types'

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

export const defaultFieldOpts: FormFieldJSON = {
  defaultValidateOn: 'submit',
  key: 'test',
  validationStrategy: defaultStrat,
}
