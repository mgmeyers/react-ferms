import * as React from 'react'

import { useFieldEffects, useFormContext, useOnBlur } from './hooks'

import { FormFieldProps, IFormContext } from 'types'

type ElementType = HTMLTextAreaElement
type Props = FormFieldProps & React.HTMLProps<ElementType>

function useOnChange(props: Props, context: IFormContext) {
  const { name, onChange } = props

  return React.useMemo(
    () => (e: React.ChangeEvent<ElementType>) => {
      if (onChange) {
        onChange(e)
      }

      context.setValue(name, e.target.value)
    },
    [name, onChange]
  )
}

export default function Textarea(props: Props) {
  const context = useFormContext()

  useFieldEffects(props, context)

  const onBlur = useOnBlur<ElementType, Props>(props, context)
  const onChange = useOnChange(props, context)

  const field = context.fields.getField(props.name)

  const { transform, validate, validateOn, ...inputProps } = props

  return (
    <textarea
      {...inputProps}
      onBlur={onBlur}
      onChange={onChange}
      value={field ? field.value : ''}
    />
  )
}
