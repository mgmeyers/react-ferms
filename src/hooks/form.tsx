import * as React from 'react'

import FormFields from 'data/FormFields'

import {
  AddFieldOpts,
  FormFieldsValidation,
  FormProps,
  TransformFn,
  ValidateOnOpts,
} from 'types'

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
  const { onError, onPromiseRejection, onSubmit, preValidate } = props

  return React.useMemo(
    () => (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (preValidate) {
        preValidate()
      }

      const res = fields.validate()

      dispatch(() => res.fields)

      res.promise
        .then(results => {
          dispatch(() => results.fields)

          if (results.valid) {
            onSubmit(fields.values)
          } else if (onError) {
            onError(results.fields.errors)
          }
        })
        .catch(onPromiseRejection)
    },
    [fields, onError, onPromiseRejection, onSubmit, preValidate]
  )
}

type Action = (f: FormFields) => FormFields

function reducer(fields: FormFields, action: Action) {
  return action(fields)
}

function mergeValidationResults(to: FormFields, from: FormFields): FormFields {
  return from.keys.reduce((newFields, k) => {
    const toField = to.getField(k)
    const fromField = from.getField(k)

    if (toField.status === fromField.status) return newFields

    return newFields
      .setStatus(k, fromField.status)
      .setErrors(k, fromField.errors)
  }, to)
}

function useContextValue(
  fields: FormFields,
  dispatch: React.Dispatch<Action>,
  onPromiseRejection: (e: any) => void
) {
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
        dispatch(f => {
          let flds = f.setValue(key, value)

          if (flds.getField(key).validateOn === 'change') {
            const results = flds.validateField(key)

            flds = results.fields

            results.promise
              .then((res: FormFieldsValidation) =>
                dispatch(prev => mergeValidationResults(prev, res.fields))
              )
              .catch(onPromiseRejection)
          }

          return flds
        })
      },
      validateField: (key: string) => {
        dispatch(f => {
          const results = f.validateField(key)

          results.promise
            .then((res: FormFieldsValidation) =>
              dispatch(prev => mergeValidationResults(prev, res.fields))
            )
            .catch(onPromiseRejection)

          return results.fields
        })
      },
    }),
    [fields]
  )
}

export function useFormState(props: FormProps) {
  const { defaults, onPromiseRejection, validateOn, validationStrategy } = props

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
    context: useContextValue(
      fields,
      dispatch,
      onPromiseRejection || console.error
    ),
    onSubmit: useOnSubmit(props, fields, dispatch),
  }
}
