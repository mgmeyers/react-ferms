import * as React from 'react'
import FormField from './FormField'

type ElType = HTMLInputElement
type InputProps = React.HTMLProps<ElType>

export class FormInput extends FormField<InputProps> {
  handleBlur = (e: React.FocusEvent<ElType>) => {
    const { onBlur, validateOn } = this.props

    if (onBlur) {
      onBlur(e)
    }

    if (validateOn === 'blur') {
      this.validate()
    }
  }

  handleChange = (e: React.ChangeEvent<ElType>) => {
    const { onChange } = this.props

    if (onChange) {
      onChange(e)
    }

    this.setValue(e.target.value)
  }

  render() {
    const { transform, validate, validateOn, ...inputProps } = this.props

    return (
      <input
        {...inputProps}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        value={this.value}
      />
    )
  }
}

export default FormField.withContext<InputProps>(FormInput)
