import * as React from 'react'
import FormField from './FormField'

class Input extends FormField<React.HTMLProps<HTMLInputElement>> {
  handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { onBlur, validateOn } = this.props

    if (onBlur) {
      onBlur(e)
    }

    if (validateOn === 'blur') {
      this.validate()
    }
  }

  handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onInput } = this.props

    if (onInput) {
      onInput(e)
    }

    this.setValue(e.target.value)
  }

  render() {
    const { transform, validate, validateOn, ...inputProps } = this.props

    return (
      <input
        {...inputProps}
        onBlur={this.handleBlur}
        onInput={this.handleInput}
        value={this.value}
      />
    )
  }
}

export default Input
