import * as React from 'react'

import FormFields from 'data/FormFields'
import { noop } from 'helpers'

import {
  AddFieldOpts,
  FormProps,
  IFormContext,
  TransformFn,
  ValidateOnOpts,
} from 'types'

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

function useFormEffects(props: FormProps, dispatch: React.Dispatch<Action>) {
  const { defaults, validateOn, validationStrategy } = props

  React.useEffect(() => {
    dispatch({
      defaults,
      type: 'setDefaults',
    })
  }, [defaults])

  React.useEffect(() => {
    dispatch({
      defaultValidateOn: validateOn,
      type: 'setDefaultValidateOn',
    })
  }, [validateOn])

  React.useEffect(() => {
    dispatch({
      type: 'setValidationStrategy',
      validationStrategy,
    })
  }, [validationStrategy])
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

      dispatch({ type: 'set', fields: results.fields })

      if (results.valid) {
        onSubmit(fields.values)
      } else if (onError) {
        onError(results.fields.errors)
      }
    },
    [fields, onError, onSubmit, preValidate]
  )
}

interface Action {
  type: string
  [k: string]: any
}

function reducer(fields: FormFields, action: Action) {
  switch (action.type) {
    case 'add':
      return fields.add(action.field)
    case 'remove':
      return fields.remove(action.key)
    case 'setTransform':
      return fields.setTransform(action.key, action.transform)
    case 'setValidateOn':
      return fields.setValidateOn(action.key, action.validateOn)
    case 'setValidation':
      return fields.setValidation(action.key, action.validate)
    case 'setValue':
      return fields.setValue(action.key, action.value)
    case 'validateField':
      return fields.validateField(action.key).fields
    case 'setDefaults':
      return fields.setDefaults(action.defaults)
    case 'setDefaultValidateOn':
      return fields.setDefaultValidateOn(action.defaultValidateOn)
    case 'setValidationStrategy':
      return fields.setValidationStrategy(action.validationStrategy)
    case 'set':
      return action.fields
  }
}

function useContextValue(fields: FormFields, dispatch: React.Dispatch<Action>) {
  return React.useMemo(
    () => ({
      add: (field: AddFieldOpts) => {
        dispatch({ type: 'add', field })
      },
      fields,
      remove: (key: string) => {
        dispatch({ type: 'remove', key })
      },
      setTransform: (key: string, transform: TransformFn) => {
        dispatch({ type: 'setTransform', key, transform })
      },
      setValidateOn: (key: string, validateOn: ValidateOnOpts) => {
        dispatch({ type: 'setValidateOn', key, validateOn })
      },
      setValidation: (key: string, validate: any) => {
        dispatch({ type: 'setValidation', key, validate })
      },
      setValue: (key: string, value: string) => {
        dispatch({ type: 'setValue', key, value })
      },
      validateField: (key: string) => {
        dispatch({ type: 'validateField', key })
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
