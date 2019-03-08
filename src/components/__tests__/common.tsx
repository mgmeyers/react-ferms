import { fireEvent, waitForElement } from 'react-testing-library'

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

export async function waitForStatus(
  getByTestId: (v: any) => any,
  status?: string
) {
  await waitForElement(() => getByTestId('3'))
  await waitForElement(() => getByTestId(status ? status : '1'))
}

export async function changeAndSubmit(
  key: string,
  value: string,
  getByTestId: (v: any) => any
) {
  fireEvent.change(getByTestId(key), { target: { value } })
  fireEvent.submit(getByTestId('f'))

  await waitForStatus(getByTestId)
}
