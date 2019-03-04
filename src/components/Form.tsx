import * as PropTypes from 'prop-types'
import * as React from 'react'

import FormFields from 'data/FormFields'
import { noop } from 'helpers'

import { useFormState } from 'hooks/form'

import { FormProps, IFormContext } from 'types'

export const FormContext = React.createContext<IFormContext>({
  add: noop,
  fields: new FormFields({}),
  remove: noop,
  setTransform: noop,
  setValidateOn: noop,
  setValidation: noop,
  setValue: noop,
  validateField: noop,
})

export default function Form(
  props: FormProps & React.HTMLProps<HTMLFormElement>
) {
  const {
    children,
    defaults,
    onError,
    onSubmit: os,
    preValidate,
    validateOn,
    validationStrategy,
    ...formProps
  } = props

  const { context, onSubmit } = useFormState(props)

  return (
    <FormContext.Provider value={context}>
      <form {...formProps} onSubmit={onSubmit}>
        {props.children}
      </form>
    </FormContext.Provider>
  )
}

Form.propTypes = {
  defaults: PropTypes.object,
  onError: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  preValidate: PropTypes.bool,
  render: PropTypes.func,
  validateOn: PropTypes.string,
  validationStrategy: PropTypes.func,
}
