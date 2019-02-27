import * as React from 'react'

import FormField from 'data/FormField'
import FormFields from 'data/FormFields'

import { FormContext } from './Form'

import { FormStatus } from 'types'

type RenderFn = (
  value: any | any[],
  status: FormStatus | FormStatus[]
) => JSX.Element

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

function getFieldVals(fields: FormField[]) {
  return fields.reduce(fieldValueReducer, {
    status: [],
    value: [],
  })
}

function getField(name: string | string[], fields: FormFields) {
  if (Array.isArray(name)) {
    return name.map(n => fields.getField(n))
  }

  return [fields.getField(name)]
}

function unwrap(v: any[]): any {
  if (v.length === 1) return v[0]
  return v
}

export function renderValue(
  render: RenderFn,
  fields: FormField[]
): JSX.Element {
  const { value, status } = getFieldVals(fields)
  return render ? render(unwrap(value), unwrap(status)) : <>{value}</>
}

export default function Value(props: ValueProps) {
  const { name, render } = props
  const fields = getField(name, React.useContext(FormContext).fields)

  return React.useMemo(() => renderValue(render, fields), [
    name,
    render,
    ...fields,
  ]) as JSX.Element
}
