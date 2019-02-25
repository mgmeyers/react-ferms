import * as React from 'react'

import FormField from 'data/FormField'
import FormFields from 'data/FormFields'

import { FormContext } from './Form'

import { FormStatus } from 'types'

type RenderFn = (
  value: any | any[],
  status: FormStatus | FormStatus[]
) => React.ReactNode

export interface ValueProps {
  name: string | string[]
  render?: RenderFn
}

function fieldValueReducer(
  data: { value: any[]; status: FormStatus[] },
  f: FormField
) {
  data.status.push(f ? f.status : FormStatus.INVALID)
  data.value.push(f ? f.value : '')

  return data
}

function getFieldVals(field: FormField | FormField[]) {
  if (!Array.isArray(field)) {
    return {
      status: field ? field.status : FormStatus.INVALID,
      value: field ? field.value : '',
    }
  } else {
    return field.reduce(fieldValueReducer, {
      status: [],
      value: [],
    })
  }
}

function getField(name: string | string[], fields: FormFields) {
  if (Array.isArray(name)) {
    return name.map(n => fields.getField(n))
  }

  return fields.getField(name)
}

export function renderValue(field: FormField | FormField[], render: RenderFn) {
  const data = getFieldVals(field)
  return render ? render(data.value, data.status) : `${data.value}`
}

export default function Value(props: ValueProps) {
  return (
    <FormContext.Consumer>
      {context => {
        const field = getField(props.name, context.fields)
        return renderValue(field, props.render)
      }}
    </FormContext.Consumer>
  )
}
