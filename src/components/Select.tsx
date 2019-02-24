import * as React from 'react'
import FormField from './FormField'

type ElementType = HTMLSelectElement
type ElementProps = React.HTMLProps<ElementType>

export class FormSelect extends FormField<ElementProps> {
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
    const { multiple, onChange } = this.props

    if (onChange) {
      onChange(e)
    }

    if (multiple) {
      const values = [].reduce.call(
        e.target.options,
        (vals: string[], v: HTMLOptionElement) => {
          if (v.selected) {
            vals.push(v.value)
          }

          return vals
        },
        []
      )

      this.setValue(values)
    } else {
      this.setValue(e.target.value)
    }
  }

  get emptyValue(): string | string[] {
    if (this.props.multiple) {
      return []
    } else {
      return ''
    }
  }

  render() {
    const {
      children,
      transform,
      validate,
      validateOn,
      ...inputProps
    } = this.props

    return (
      <select
        {...inputProps}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        value={this.value || this.emptyValue}
      >
        {children}
      </select>
    )
  }
}

export default FormField.withContext<ElementProps>(FormSelect)
