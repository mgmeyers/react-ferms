import * as React from 'react'
import FormField from './FormField'

type ElementType = HTMLTextAreaElement
type ElementProps = React.HTMLProps<ElementType>

export class FormTextarea extends FormField<ElementProps> {
  handleBlur = (e: React.FocusEvent<ElementType>) => {
    const { onBlur, validateOn } = this.props

    if (onBlur) {
      onBlur(e)
    }

    if (validateOn === 'blur') {
      this.validate()
    }
  }

  handleChange = (e: React.ChangeEvent<ElementType>) => {
    const { onChange } = this.props

    if (onChange) {
      onChange(e)
    }

    this.setValue(e.target.value)
  }

  render() {
    const {
      context,
      transform,
      validate,
      validateOn,
      ...inputProps
    } = this.props

    return (
      <textarea
        {...inputProps}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        value={this.value}
      />
    )
  }
}

export default FormField.withContext<ElementProps>(FormTextarea)
