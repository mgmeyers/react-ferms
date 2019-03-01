import * as React from 'react'

import { FormContext } from 'components/Form'
import { FormFieldProps, IFormContext } from 'types'

export function useFieldEffects<T>(
  props: FormFieldProps & T,
  context: IFormContext
) {
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

export function useFormContext() {
  return React.useContext(FormContext)
}

type BlurrableProp<T> = FormFieldProps & {
  onBlur?: (e: React.FocusEvent<T>) => void
}

export function useOnBlur<T, P>(
  props: BlurrableProp<T> & P,
  context: IFormContext
) {
  const { name, onBlur, validateOn } = props

  return React.useMemo(
    () => (e: React.FocusEvent<T>) => {
      if (onBlur) {
        onBlur(e)
      }

      if (validateOn === 'blur') {
        context.validateField(name)
      }
    },
    [name, onBlur, validateOn]
  )
}
