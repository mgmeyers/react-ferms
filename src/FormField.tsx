import * as prop from 'prop-ops'

import { alwaysValid, noop } from 'helpers'

import {
  FormStatus,
  TransformFn,
  ValidationFn,
  ValidateOnOpts,
  ValidationResults,
} from 'types'

interface FormFieldDef {
  errors?: Array<string | JSX.Element>
  key: string
  status?: FormStatus
  transform?: TransformFn
  validate?: ValidationFn
  validateOn?: ValidateOnOpts
  value?: string
}

interface FormFieldValidation {
  field: FormField
  valid: boolean
}

export default class FormField {
  private field: FormFieldDef

  constructor(fieldDef: FormFieldDef) {
    this.field = fieldDef
  }

  validate(): FormFieldValidation {
    const validate = this.field.validate || alwaysValid
    const results = validate(this.value)

    if (results === true) {
      return {
        field: this,
        valid: true,
      }
    }

    const updatedField = prop.set(
      prop.set(this.field, 'status', FormStatus.INVALID),
      'errors',
      results
    ) as FormFieldDef

    return {
      field: new FormField(updatedField),
      valid: false,
    }
  }

  isValid(): boolean {
    return this.status !== FormStatus.INVALID
  }

  get errors(): Array<string | JSX.Element> {
    return this.field.errors || []
  }

  get key(): string {
    return this.field.key
  }

  setKey(value: string): FormField {
    return this.update('key', value)
  }

  get status(): FormStatus {
    return this.field.status || FormStatus.PRISTINE
  }

  get validateOn(): ValidateOnOpts {
    return this.field.validateOn || 'submit'
  }

  setValidateOn(value: ValidateOnOpts): FormField {
    return this.update('validateOn', value)
  }

  get value(): string {
    const transform = this.field.transform || noop
    return transform(this.field.value || '')
  }

  get rawValue(): string {
    return this.field.value || ''
  }

  setValue(value: string): FormField {
    return this.update('value', value)
  }

  setTransform(value: TransformFn): FormField {
    return this.update('transform', value)
  }

  setValidate(value: ValidationFn): FormField {
    return this.update('validate', value)
  }

  private update(key: string, value: any): FormField {
    const updatedField = prop.set(this.field, key, value) as FormFieldDef

    return new FormField(updatedField)
  }
}
