import * as React from 'react'

import { FormContext, IFormContext } from './Form'
import { TransformFn, ValidateOnOpts } from 'types'

interface FieldProps {
  name: string

  transform?: TransformFn
  validate?: any
  validateOn?: ValidateOnOpts
}

abstract class FormField<T> extends React.PureComponent<
  FieldProps & T,
  {},
  IFormContext
> {
  context: IFormContext
  contextType = FormContext

  componentDidMount() {
    const { name: key, transform, validate, validateOn } = this.props

    this.context.add({
      key,
      transform,
      validate,
      validateOn,
    })
  }

  componentDidUpdate(prevProps: FieldProps) {
    const { name: key, transform, validate, validateOn } = this.props

    if (transform !== prevProps.transform) {
      this.context.setTransform(key, transform)
    }

    if (validate !== prevProps.validate) {
      this.context.setValidation(key, validate)
    }

    if (validateOn !== prevProps.validateOn) {
      this.context.setValidateOn(key, validateOn)
    }
  }

  componentWillUnmount() {
    this.context.remove(this.props.name)
  }

  validate() {
    this.context.validateField(this.props.name)
  }

  setValue(value: string) {
    this.context.setValue(this.props.name, value)
  }

  get value() {
    return this.context.fields.getField(this.props.name).value
  }
}

export default FormField
