import * as PropTypes from 'prop-types'
import * as React from 'react'

import FormFields from 'data/FormFields'
import { useFormContext } from 'hooks/field'
import { FormStatus } from 'types'

type RenderFn = (status: FormStatus) => JSX.Element

export interface StatusProps {
  name?: string
  render: RenderFn
}

export function renderStatus(
  name: string,
  render: RenderFn,
  fields: FormFields
): JSX.Element {
  const status = !name
    ? fields.status
    : fields.getField(name)
    ? fields.getField(name).status
    : null

  if (status === null) return null

  return render(status)
}

export default function Status(props: StatusProps) {
  const { name, render } = props

  const fields = useFormContext().fields

  return React.useMemo(() => renderStatus(name, render, fields), [
    name,
    render,
    fields,
  ])
}

Status.propTypes = {
  name: PropTypes.string,
  render: PropTypes.func.isRequired,
}
