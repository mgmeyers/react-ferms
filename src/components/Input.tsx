import * as React from 'react'
import FormField from './FormField'

type ElementType = HTMLInputElement
type ElementProps = React.HTMLProps<ElementType>

export class FormInput extends FormField<ElementProps> {
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
    const { onChange, value } = this.props

    if (onChange) {
      onChange(e)
    }

    if (this.isCheckbox) {
      const checked = e.target.checked
      const currentValue = this.rawValue as string[]

      let nextValue: string[] = []

      nextValue = checked
        ? [...currentValue, value as string]
        : currentValue.splice(currentValue.indexOf(value as string), 1)

      this.setValue(nextValue)
    } else {
      this.setValue(e.target.value)
    }
  }

  get isCheckbox(): boolean {
    return this.props.type === 'checkbox'
  }

  get checked(): boolean {
    return this.value ? this.value.includes(this.props.value as string) : false
  }

  render() {
    const {
      context,
      transform,
      validate,
      validateOn,
      ...inputProps
    } = this.props

    const props = {
      ...inputProps,
      onBlur: this.handleBlur,
      onChange: this.handleChange,
    }

    if (this.isCheckbox) {
      props.checked = this.checked
    } else {
      props.value = this.value
    }

    return <input {...props} />
  }
}

export default FormField.withContext<ElementProps>(FormInput)
