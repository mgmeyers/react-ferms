import * as React from 'react'

import { FormContext } from 'components/Form'
import { AddFieldOpts, FormFieldProps, IFormContext } from 'types'

export function useFieldEffects<T>(
  props: FormFieldProps & T,
  context: IFormContext
) {
  const { multiple, name: key, type, transform, validate, validateOn } = props
  const keyRef = React.useRef('')

  React.useEffect(() => {
    const fieldDef: AddFieldOpts = {
      key,
      multiple: multiple || type === 'checkbox',
      transform,
      validate,
      validateOn,
    }

    if (!keyRef.current) {
      keyRef.current = key
    } else {
      fieldDef.value = context.fields.getField(keyRef.current).rawValue
    }

    context.add(fieldDef)

    return () => {
      context.remove(keyRef.current)
      keyRef.current = key
    }
  }, [key])

  React.useEffect(() => {
    context.setTransform(key, transform)
  }, [transform])

  React.useEffect(() => {
    context.setValidation(key, validate)
  }, [validate])

  React.useEffect(() => {
    context.setValidateOn(key, validateOn)
  }, [validateOn])
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
