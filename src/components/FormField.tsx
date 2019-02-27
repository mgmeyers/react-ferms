import * as React from 'react'

import { FormContext } from 'components/Form'
import { FormFieldProps, IFormContext, Omit } from 'types'

function registerField<T>(props: FormFieldProps & T, context: IFormContext) {
  const { multiple, name: key, type, transform, validate, validateOn } = props

  React.useEffect(() => {
    context.add({
      key,
      multiple: multiple || type === 'checkbox',
      transform,
      validate,
      validateOn,
    })

    return () => {
      context.remove(key)
    }
  }, [])

  React.useEffect(() => {
    context.setTransform(key, transform)
  }, [key, transform])

  React.useEffect(() => {
    context.setValidation(key, validate)
  }, [key, validate])

  React.useEffect(() => {
    context.setValidateOn(key, validateOn)
  }, [key, validateOn])
}

export function useFormContext<T>(props: FormFieldProps & T) {
  const context = React.useContext(FormContext)

  registerField<T>(props, context)

  return context
}
