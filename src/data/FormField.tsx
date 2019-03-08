import * as prop from 'prop-ops'

import { alwaysValid, noop } from 'helpers'

import {
  FormFieldJSON,
  FormFieldValidation,
  FormStatus,
  TransformFn,
  ValidateOnOpts,
  ValidationStrategy,
} from 'types'

export default class FormField {
  private field: FormFieldJSON

  constructor(fieldDef: FormFieldJSON) {
    this.field = fieldDef
  }

  validate() {
    const field = new FormField(prop.set(
      this.field,
      'status',
      FormStatus.VALIDATING
    ) as FormFieldJSON)

    return {
      field,
      promise: field.validateAsync(),
    }
  }

  async validateAsync(): Promise<FormFieldValidation> {
    const validationStrategy = this.field.validationStrategy
    const validate = this.field.validate || alwaysValid
    const results = await validationStrategy(this.value, validate)
    const valid = results === true

    const updatedField = prop.set.mutate(
      prop.set(
        this.field,
        'status',
        valid ? FormStatus.DIRTY : FormStatus.INVALID
      ),
      'errors',
      valid ? [] : Array.isArray(results) ? results : [results]
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

  get validationStrategy(): any {
    return this.field.validationStrategy
  }

  get value(): string | string[] {
    const transform = this.field.transform || noop
    return transform(this.field.value || this.emptyValue)
  }

  get rawValue(): string | string[] {
    return this.field.value || this.emptyValue
  }

  get emptyValue(): string | string[] {
    return this.field.multiple ? [] : ''
  }

  setKey(value: string): FormField {
    return this.update('key', value)
  }

  setValue(value: string | string[]): FormField {
    let updatedField = this.update('value', value)

    if (this.status === FormStatus.PRISTINE) {
      updatedField = updatedField.update('status', FormStatus.DIRTY)
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
