import * as React from 'react'

interface FormProps {
  hello: string
}

export default (props: FormProps) => {
  return <p>{props.hello}</p>
}
