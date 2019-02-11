import * as React from 'react'
import * as prop from 'prop-ops'

import { FormProps, FormStatus, TransformFn, ValidationFn } from 'types'

interface MapStringAny {
  [key: string]: any
}

interface Errors {
  [key: string]: Errors | Array<string | JSX.Element>
}

interface FormState {
  errors: Errors
  status: FormStatus
  transforms: { [key: string]: TransformFn }
  validations: { [key: string]: ValidationFn }
  values: MapStringAny
}

export const FormContext = React.createContext<FormState>({
  errors: {},
  status: FormStatus.PRISTINE,
  transforms: {},
  validations: {},
  values: {},
})

function valueReducer(
  self: (op: TransformFn | MapStringAny, val: any) => MapStringAny,
  operators: MapStringAny,
  values: MapStringAny
) {
  return (vals: MapStringAny, key: string) => {
    const op = operators[key]
    const value = values[key]

    // If it's not a function we assume it's a nested object
    if (typeof op === 'function') {
      return prop.set(vals, key, op(value))
    } else {
      return self(op, value)
    }
  }
}

class Form extends React.Component<FormProps, FormState> {
  state: FormState = {
    errors: {},
    status: FormStatus.PRISTINE,
    transforms: {},
    validations: {},
    values: {},
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const { validations } = this.state
    const { onSubmit, preValidate } = this.props

    const transformedVals = this.transform()

    if (preValidate) {
      preValidate(transformedVals)
    }

    // TODO: change datastructure
    // { fields: { string: { value, errors, status } } }
    // TODO: validate and save errors along the way
    const validationRes = this.validate(validations, transformedVals)

    // TODO: set form status

    if (validationRes.isValid) {
      onSubmit(transformedVals)
    }
  }

  validate(
    validations = this.state.validations,
    values: MapStringAny
  ): MapStringAny {
    return Object.keys(validations).reduce(
      valueReducer(this.validate, validations, values),
      {}
    )
  }

  transform(
    transforms = this.state.transforms,
    values = this.state.values
  ): MapStringAny {
    return Object.keys(transforms).reduce(
      valueReducer(this.validate, transforms, values),
      {}
    )
  }

  _set(what: string, key: string, value: any) {
    this.setState(state => {
      return prop.set(state, `${what}.${key}`, value, true)
    })
  }

  setTransform = (key: string, transformFn: TransformFn) => {
    this._set('transforms', key, transformFn)
  }

  setValidation = (key: string, validationFn: ValidationFn) => {
    this._set('validations', key, validationFn)
  }

  setValue = (key: string, value: string) => {
    // TODO: set form status
    // TODO: validate onchange if selected
    this._set('values', key, value)
  }

  render() {
    return (
      <FormContext.Provider value={this.state}>
        <form>{this.props.children}</form>
      </FormContext.Provider>
    )
  }
}

export default Form
