import * as React from 'react'

import FormField from 'data/FormField'

import { FormContext } from './Form'

type RenderFn = (errors: Array<string | Error | JSX.Element>) => React.ReactNode

export interface ErrorProps {
  name: string
  render?: RenderFn
}

export function renderError(render: RenderFn, field: FormField) {
  if (!field) return null

  const errors = field.errors

  return render
    ? render(errors)
    : errors.map((e, i) => (
        <div key={i}>{e instanceof Error ? e.message : e}</div>
      ))
}

export default function Err(props: ErrorProps) {
  return (
    <FormContext.Consumer>
      {context => {
        return renderError(props.render, context.fields.getField(props.name))
      }}
    </FormContext.Consumer>
  )
}
