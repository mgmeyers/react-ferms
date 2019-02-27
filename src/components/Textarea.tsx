import * as React from 'react'
import { useFormContext } from './FormField'

import { FormFieldProps, IFormContext } from 'types'

type ElementType = HTMLTextAreaElement
type ElementProps = React.HTMLProps<ElementType>
type Props = FormFieldProps & ElementProps

function useHandlers(props: Props, context: IFormContext) {
  const { name, onBlur, onChange, validateOn } = props

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

        context.setValue(name, e.target.value)
      },
    }),
    [name, validateOn, onBlur, onChange]
  )
}

export default function Textarea(props: Props) {
  const context = useFormContext<ElementProps>(props)
  const handlers = useHandlers(props, context)

  const field = context.fields.getField(props.name)

  const { transform, validate, validateOn, ...inputProps } = props

  return (
    <textarea
      {...inputProps}
      onBlur={handlers.handleBlur}
      onChange={handlers.handleChange}
      value={field ? field.value : ''}
    />
  )
}
