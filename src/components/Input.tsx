import * as React from 'react'

import FormField from 'data/FormField'
import { useFormContext } from './FormField'

import { FormFieldProps, IFormContext } from 'types'

type ElementType = HTMLInputElement
type ElementProps = React.HTMLProps<ElementType>
type Props = FormFieldProps & ElementProps

function isCheckbox(props: Props) {
  return props.type === 'checkbox'
}

function isChecked(val: string, field: FormField) {
  const value = field ? field.value : []
  return value.includes(val)
}

function useHandlers(props: Props, context: IFormContext) {
  const { name, onBlur, onChange, value, validateOn } = props
  const field = context.fields.getField(name)

  return React.useMemo(
    () => ({
      handleBlur: (e: React.FocusEvent<ElementType>) => {
        if (onBlur) {
          onBlur(e)
        }

        if (validateOn === 'blur') {
          context.validateField(name)
        }
      },

      handleChange: (e: React.ChangeEvent<ElementType>) => {
        if (onChange) {
          onChange(e)
        }

        if (isCheckbox(props)) {
          const checked = e.target.checked
          const currentValue = field ? (field.rawValue as string[]) : []

          let nextValue: string[] = []

          nextValue = checked
            ? [...currentValue, value as string]
            : currentValue.splice(currentValue.indexOf(value as string), 1)

          context.setValue(name, nextValue)
        } else {
          context.setValue(name, e.target.value)
        }
      },
    }),
    [value, name, validateOn, onBlur, onChange, field]
  )
}

export default function Input(props: Props) {
  const context = useFormContext<ElementProps>(props)
  const handlers = useHandlers(props, context)

  const field = context.fields.getField(props.name)
  const value = field ? field.value : ''

  const { transform, validate, validateOn, ...otherProps } = props

  const inputProps = {
    ...otherProps,
    onBlur: handlers.handleBlur,
    onChange: handlers.handleChange,
  }

  if (isCheckbox(props)) {
    inputProps.checked = isChecked(props.value as string, field)
  } else {
    inputProps.value = value
  }

  return <input {...inputProps} />
}
