import * as React from 'react'
import * as prop from 'prop-ops'

import FormFields from 'data/FormFields'

import { FormProps } from 'types'

interface FormState {
  fields: FormFields
}

export const FormContext = React.createContext<FormState>({
  fields: new FormFields(),
})

class Form extends React.Component<FormProps, FormState> {
  static defaultProps = {
    validateOn: 'submit',
  }

  state: FormState = {
    fields: new FormFields(),
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const { onError, onSubmit, preValidate } = this.props
    const { fields } = this.state

    if (preValidate) {
      preValidate()
    }

    const results = fields.validate()

    if (results.valid) {
      onSubmit(fields.values)
    } else if (onError) {
      this.setState(state => prop.set(state, 'fields', results.fields))
      onError(results.fields.errors)
    }
  }

  render() {
    return (
      <FormContext.Provider value={this.state}>
        <form>{this.props.children}</form>
      </FormContext.Provider>
    )
  }
}

export default Form
