import * as React from 'react'

import FormField from 'data/FormField'

import { useFieldEffects, useFormContext, useOnBlur } from './hooks'

import { FormFieldProps, IFormContext } from 'types'

type ElementType = HTMLInputElement
type Props = FormFieldProps & React.HTMLProps<ElementType>

function isCheckbox(props: Props) {
  return props.type === 'checkbox'
}

function isChecked(val: string, field: FormField) {
  const value = field ? field.value : []
  return value.includes(val)
}

function useOnChange(props: Props, context: IFormContext) {
  const { name, onChange, value } = props
  const field = context.fields.getField(name)

  return React.useMemo(
    () => (e: React.ChangeEvent<ElementType>) => {
      if (onChange) {
        onChange(e)
      }

      if (isCheckbox(props)) {
        const checked = e.target.checked
        const currentValue = field.rawValue as string[]
        const nextValue = [...currentValue]

        if (checked) {
          nextValue.push(value as string)
        } else {
          nextValue.splice(currentValue.indexOf(value as string), 1)
        }

        context.setValue(name, nextValue)
      } else {
        context.setValue(name, e.target.value)
      }
    },
    [field, name, onChange, value]
  )
}

export default function Input(props: Props) {
  const context = useFormContext()

  useFieldEffects(props, context)

  const onBlur = useOnBlur<ElementType, Props>(props, context)
  const onChange = useOnChange(props, context)

  const field = context.fields.getField(props.name)
  const value = field ? field.value : ''

  const { transform, validate, validateOn, ...otherProps } = props

  const inputProps = {
    ...otherProps,
    onBlur,
    onChange,
  }

  if (isCheckbox(props)) {
    inputProps.checked = isChecked(props.value as string, field)
  } else {
    inputProps.value = value
  }

  return <input {...inputProps} />
}
