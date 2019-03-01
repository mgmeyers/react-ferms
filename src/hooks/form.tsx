import * as React from 'react'

import FormFields from 'data/FormFields'

import { AddFieldOpts, FormProps, TransformFn, ValidateOnOpts } from 'types'

function useFormEffects(props: FormProps, dispatch: React.Dispatch<Action>) {
  const { defaults, validateOn, validationStrategy } = props

  React.useEffect(() => dispatch(f => f.setDefaults(defaults)), [defaults])
  React.useEffect(() => dispatch(f => f.setDefaultValidateOn(validateOn)), [
    validateOn,
  ])
  React.useEffect(
    () => dispatch(f => f.setValidationStrategy(validationStrategy)),
    [validationStrategy]
  )
}

function useOnSubmit(
  props: FormProps,
  fields: FormFields,
  dispatch: React.Dispatch<Action>
) {
  const { onError, onSubmit, preValidate } = props

  return React.useMemo(
    () => (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (preValidate) {
        preValidate()
      }

      const results = fields.validate()

      dispatch(() => results.fields)

      if (results.valid) {
        onSubmit(fields.values)
      } else if (onError) {
        onError(results.fields.errors)
      }
    },
    [fields, onError, onSubmit, preValidate]
  )
}

type Action = (f: FormFields) => FormFields

function reducer(fields: FormFields, action: Action) {
  return action(fields)
}

function useContextValue(fields: FormFields, dispatch: React.Dispatch<Action>) {
  return React.useMemo(
    () => ({
      add: (field: AddFieldOpts) => {
        dispatch(f => f.add(field))
      },
      fields,
      remove: (key: string) => {
        dispatch(f => f.remove(key))
      },
      setTransform: (key: string, transform: TransformFn) => {
        dispatch(f => f.setTransform(key, transform))
      },
      setValidateOn: (key: string, validateOn: ValidateOnOpts) => {
        dispatch(f => f.setValidateOn(key, validateOn))
      },
      setValidation: (key: string, validate: any) => {
        dispatch(f => f.setValidation(key, validate))
      },
      setValue: (key: string, value: string) => {
        dispatch(f => f.setValue(key, value))
      },
      validateField: (key: string) => {
        dispatch(f => f.validateField(key).fields)
      },
    }),
    [fields]
  )
}

export function useFormState(props: FormProps) {
  const { defaults, validateOn, validationStrategy } = props

  const [fields, dispatch] = React.useReducer(
    reducer,
    new FormFields({
      defaults,
      validateOn,
      validationStrategy,
    })
  )

  useFormEffects(props, dispatch)

  return {
    context: useContextValue(fields, dispatch),
    onSubmit: useOnSubmit(props, fields, dispatch),
  }
}
