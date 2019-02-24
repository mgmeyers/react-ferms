import * as React from 'react'

import { FormContext, IFormContext } from './Form'
import { Omit, TransformFn, ValidateOnOpts } from 'types'

export interface FormFieldProps {
  context: IFormContext
  name: string

  multiple?: boolean
  transform?: TransformFn
  type?: string
  validate?: any
  validateOn?: ValidateOnOpts
}

abstract class FormField<T> extends React.PureComponent<FormFieldProps & T> {
  static withContext<P>(Component: React.ComponentType<FormFieldProps & P>) {
    return function ContextedComponent(
      props: Omit<FormFieldProps & P, 'context'>
    ) {
      return (
        <FormContext.Consumer>
          {ctx => <Component {...props as FormFieldProps & P} context={ctx} />}
        </FormContext.Consumer>
      )
    }
  }

  constructor(props: FormFieldProps & T) {
    super(props)

    const {
      context,
      multiple,
      name: key,
      transform,
      type,
      validate,
      validateOn,
    } = props

    context.add({
      key,
      multiple: multiple || type === 'checkbox',
      transform,
      validate,
      validateOn,
    })
  }

  componentDidUpdate(prevProps: FormFieldProps) {
    const { context, name: key, transform, validate, validateOn } = this.props

    if (transform !== prevProps.transform) {
      context.setTransform(key, transform)
    }

    if (validate !== prevProps.validate) {
      context.setValidation(key, validate)
    }

    if (validateOn !== prevProps.validateOn) {
      context.setValidateOn(key, validateOn)
    }
  }

  componentWillUnmount() {
    this.props.context.remove(this.props.name)
  }

  validate() {
    this.props.context.validateField(this.props.name)
  }

  setValue(value: string | string[]) {
    this.props.context.setValue(this.props.name, value)
  }

  get value() {
    const field = this.props.context.fields.getField(this.props.name)
    return field ? field.value : ''
  }

  get rawValue() {
    const field = this.props.context.fields.getField(this.props.name)
    return field ? field.rawValue : ''
  }
}

export default FormField
