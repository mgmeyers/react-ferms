import * as React from 'react'

import FormField from 'data/FormField'

import { FormContext } from './Form'

type RenderFn = (errors: Array<string | Error | JSX.Element>) => JSX.Element

export interface ErrorProps {
  name: string
  render?: RenderFn
}

export function renderError(render: RenderFn, field: FormField): JSX.Element {
  if (!field) return null

  const errors = field.errors

  return render ? (
    render(errors)
  ) : (
    <>
      {errors.map((e, i) => (
        <div key={i}>{e instanceof Error ? e.message : e}</div>
      ))}
    </>
  )
}

export default function Err(props: ErrorProps) {
  const { name, render } = props
  const field = React.useContext(FormContext).fields.getField(name)

  return React.useMemo(() => renderError(render, field), [name, render, field])
}
