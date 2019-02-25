import * as React from 'react'

import FormField from 'data/FormField'

import { FormContext } from './Form'

type RenderFn = (errors: Array<string | JSX.Element>) => React.ReactNode

export interface ErrorProps {
  name: string
  render?: RenderFn
}

export function renderError(render: RenderFn, field: FormField) {
  if (!field) return null

  const errors = field.errors

  return render ? render(errors) : errors.map((e, i) => <div key={i}>{e}</div>)
}

export default function Error(props: ErrorProps) {
  return (
    <FormContext.Consumer>
      {context => {
        return renderError(props.render, context.fields.getField(props.name))
      }}
    </FormContext.Consumer>
  )
}
