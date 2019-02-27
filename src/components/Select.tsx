import * as React from 'react'
import { useFormContext } from './FormField'

import { FormFieldProps, IFormContext } from 'types'

type ElementType = HTMLSelectElement
type ElementProps = React.HTMLProps<ElementType>
type Props = FormFieldProps & ElementProps

function useHandlers(props: Props, context: IFormContext) {
  const { multiple, name, onBlur, onChange, validateOn } = props

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

          context.setValue(name, values)
        } else {
          context.setValue(name, e.target.value)
        }
      },
    }),
    [multiple, name, validateOn, onBlur, onChange]
  )
}

function getEmptyValue(multiple: boolean): string | string[] {
  if (multiple) {
    return []
  } else {
    return ''
  }
}

export default function Select(props: Props) {
  const context = useFormContext<ElementProps>(props)
  const handlers = useHandlers(props, context)

  const field = context.fields.getField(props.name)
  const value = field ? field.value : getEmptyValue(props.multiple)

  const { children, transform, validate, validateOn, ...inputProps } = props

  return (
    <select
      {...inputProps}
      onBlur={handlers.handleBlur}
      onChange={handlers.handleChange}
      value={value}
    >
      {children}
    </select>
  )
}
