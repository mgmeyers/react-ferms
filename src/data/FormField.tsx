import * as prop from 'prop-ops'

import { alwaysValid, noop } from 'helpers'

import {
  FormFieldJSON,
  FormStatus,
  TransformFn,
  ValidateOnOpts,
  ValidationStrategy,
} from 'types'

export interface FormFieldValidation {
  field: FormField
  valid: boolean
}

export default class FormField {
  field: FormFieldJSON

  constructor(fieldDef: FormFieldJSON) {
    this.field = fieldDef
  }

  validate(): FormFieldValidation {
    const validationStrategy = this.field.validationStrategy
    const validate = this.field.validate || alwaysValid
    const results = validationStrategy(this.value, validate)
    const valid = results === true

    const updatedField = prop.set.mutate(
      prop.set(
        this.field,
        'status',
        valid ? FormStatus.DIRTY : FormStatus.INVALID
      ),
      'errors',
      valid ? [] : results
    ) as FormFieldJSON

    return {
      field: new FormField(updatedField),
      valid,
    }
  }

  get isValid(): boolean {
    return this.status !== FormStatus.INVALID
  }

  get errors(): Array<string | JSX.Element> {
    return this.field.errors || []
  }

  get key(): string {
    return this.field.key
  }

  get status(): FormStatus {
    return this.field.status || FormStatus.PRISTINE
  }

  get validateOn(): ValidateOnOpts {
    return this.field.validateOn || this.field.defaultValidateOn
  }

  get value(): string {
    const transform = this.field.transform || noop
    return transform(this.field.value || '')
  }

  get rawValue(): string {
    return this.field.value || ''
  }

  setKey(value: string): FormField {
    return this.update('key', value)
  }

  setValue(value: string): FormField {
    let updatedField = this.update('value', value)

    if (this.validateOn === 'change') {
      updatedField = updatedField.validate().field
    }

    return updatedField
  }

  setTransform(value: TransformFn): FormField {
    return this.update('transform', value)
  }

  setValidate(value: any): FormField {
    return this.update('validate', value)
  }

  setValidateOn(value: ValidateOnOpts): FormField {
    return this.update('validateOn', value)
  }

  setDefaultValidateOn(value: ValidateOnOpts): FormField {
    return this.update('defaultValidateOn', value)
  }

  setValidationStrategy(value: ValidationStrategy): FormField {
    return this.update('validationStrategy', value)
  }

  private update(key: string, value: any): FormField {
    const updatedField = prop.set(this.field, key, value) as FormFieldJSON

    return new FormField(updatedField)
  }
}