import * as PropTypes from 'prop-types'
import * as React from 'react'

import { useFieldEffects, useFormContext, useOnBlur } from '../hooks/field'

import { FormFieldProps, IFormContext } from 'types'

type ElementType = HTMLSelectElement
type Props = FormFieldProps & React.HTMLProps<ElementType>

function useOnChange(props: Props, context: IFormContext) {
  const { multiple, name, onChange } = props

  return React.useMemo(
    () => (e: React.ChangeEvent<ElementType>) => {
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
    [multiple, name, onChange]
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
  const context = useFormContext()

  useFieldEffects(props, context)

  const onBlur = useOnBlur<ElementType, Props>(props, context)
  const onChange = useOnChange(props, context)

  const field = context.fields.getField(props.name)
  const value = field ? field.rawValue : getEmptyValue(props.multiple)

  const { children, transform, validate, validateOn, ...inputProps } = props

  return (
    <select {...inputProps} onBlur={onBlur} onChange={onChange} value={value}>
      {children}
    </select>
  )
}

Select.propTypes = {
  multiple: PropTypes.bool,
  name: PropTypes.string.isRequired,
  transform: PropTypes.func,
  validate: PropTypes.func,
  validateOn: PropTypes.string,
}
