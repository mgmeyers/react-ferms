import * as prop from 'prop-ops'
import FormField from 'FormField'

import { alwaysValid, noop, sanitizeKey } from 'helpers'

import {
  FormProps,
  FormStatus,
  MapStringAny,
  TransformFn,
  ValidateOnOpts,
  ValidationFn,
  ValidationResults,
} from 'types'

interface MapStringFormField {
  [key: string]: FormField
}

interface FormFieldsValidation {
  fields: FormFields
  valid: boolean
}

export default class FormFields {
  defaults: MapStringAny
  fields: MapStringFormField
  globalValidateOn: ValidateOnOpts
  globalStatus: FormStatus

  constructor(
    defaults: MapStringAny = {},
    globalValidateOn: ValidateOnOpts = 'submit',
    fields: MapStringFormField = {},
    globalStatus: FormStatus = FormStatus.PRISTINE
  ) {
    this.fields = fields
    this.defaults = defaults
    this.globalValidateOn = globalValidateOn
    this.globalStatus = globalStatus
  }

  validate(): FormFieldsValidation {
    const errs: ValidationResults = []

    const fields = Object.keys(this.fields).reduce(
      (newFields: MapStringFormField, key) => {
        const result = this.fields[key].validate()

        if (!result.valid) {
          errs.push(...result.field.errors)
        }

        newFields[key] = result.field

        return fields
      },
      {}
    ) as MapStringFormField

    const valid = errs.length === 0

    return {
      fields: valid
        ? this
        : new FormFields(
            this.defaults,
            this.globalValidateOn,
            fields,
            FormStatus.INVALID
          ),
      valid,
    }
  }

  validateField(key: string): FormFieldsValidation {
    const result = this.getField(key).validate()
    return {
      fields: result.valid
        ? this
        : this.update(key, result.field, FormStatus.INVALID),
      valid: result.valid,
    }
  }

  get errors(): ValidationResults {
    const errs: ValidationResults = []

    Object.keys(this.fields).forEach(key => {
      const fieldErrs = this.fields[key].errors
      if (fieldErrs.length > 0) {
        errs.push(...this.fields[key].errors)
      }
    })

    return errs
  }

  get values() {
    return Object.keys(this.fields).reduce((values, key) => {
      return prop.set(values, key, this.fields[key].value)
    }, {})
  }

  get status(): FormStatus {
    return this.globalStatus
  }

  add(
    key: string,
    value: string = '',
    transform = noop,
    validate = alwaysValid,
    validateOn = this.globalValidateOn
  ): FormFields {
    const defaultValue = value ? value : prop.get(this.defaults, key, '')

    const field = new FormField({
      key,
      status: value === '' ? FormStatus.PRISTINE : FormStatus.DIRTY,
      transform,
      validate,
      validateOn,
      value: defaultValue,
    })

    return this.update(key, field)
  }

  remove(key: string): FormFields {
    return new FormFields(
      this.defaults,
      this.globalValidateOn,
      prop.del(this.fields, sanitizeKey(key)) as MapStringFormField,
      this.globalStatus
    )
  }

  setTransform(key: string, transformFn: TransformFn): FormFields {
    const field = this.getField(key).setTransform(transformFn)
    return this.update(key, field)
  }

  setValidation(key: string, validationFn: ValidationFn): FormFields {
    const field = this.getField(key).setValidate(validationFn)
    return this.update(key, field)
  }

  setValue(key: string, value: string): FormFields {
    const field = this.getField(key).setValue(value)
    const status =
      this.globalStatus === FormStatus.PRISTINE
        ? FormStatus.DIRTY
        : this.globalStatus
    return this.update(key, field, status)
  }

  private getField(key: string): FormField {
    const fieldKey = sanitizeKey(key)
    return this.fields[fieldKey]
  }

  private update(
    key: string,
    field: FormField,
    status: FormStatus = this.globalStatus
  ): FormFields {
    const fieldKey = sanitizeKey(key)

    return new FormFields(
      this.defaults,
      this.globalValidateOn,
      prop.set(this.fields, fieldKey, field) as MapStringFormField,
      status
    )
  }
}
