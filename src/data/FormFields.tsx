import * as prop from 'prop-ops'
import FormField from 'data/FormField'

import { alwaysValid, noop, sanitizeKey } from 'helpers'
import defaultValidationStrat from 'validation-strategy/default'

import {
  FormStatus,
  MapStringAny,
  TransformFn,
  ValidateOnOpts,
  ValidationResults,
  ValidationStrategy,
} from 'types'

interface MapStringFormField {
  [key: string]: FormField
}

interface MapStringValidationResults {
  [key: string]: ValidationResults
}

export interface FormFieldsValidation {
  fields: FormFields
  valid: boolean
}

export interface AddFieldOpts {
  key: string

  transform?: TransformFn
  validate?: any
  validateOn?: ValidateOnOpts
  validationStrategy?: ValidationStrategy
  value?: string
}

export default class FormFields {
  private defaults: MapStringAny
  private fields: MapStringFormField
  private globalValidateOn: ValidateOnOpts

  constructor(
    defaults: MapStringAny = {},
    globalValidateOn: ValidateOnOpts = 'submit',
    fields: MapStringFormField = {}
  ) {
    this.defaults = defaults
    this.globalValidateOn = globalValidateOn
    this.fields = fields
  }

  add(opts: AddFieldOpts): FormFields {
    const status = !opts.value ? FormStatus.PRISTINE : FormStatus.DIRTY

    const field = new FormField({
      defaultValidateOn: this.globalValidateOn,
      key: opts.key,
      status,
      transform: opts.transform,
      validate: opts.validate,
      validateOn: opts.validateOn,
      validationStrategy: opts.validationStrategy || defaultValidationStrat,
      value: opts.value || prop.get(this.defaults, opts.key, ''),
    })

    return this.update(opts.key, field)
  }

  remove(key: string): FormFields {
    return new FormFields(this.defaults, this.globalValidateOn, prop.del(
      this.fields,
      sanitizeKey(key)
    ) as MapStringFormField)
  }

  validate(): FormFieldsValidation {
    let valid = true

    const fields = Object.keys(this.fields).reduce(
      (newFields: MapStringFormField, key) => {
        const result = this.fields[key].validate()

        if (!result.valid) {
          valid = false
        }

        newFields[key] = result.field

        return newFields
      },
      {}
    ) as MapStringFormField

    return {
      fields: new FormFields(this.defaults, this.globalValidateOn, fields),
      valid,
    }
  }

  validateField(key: string): FormFieldsValidation {
    const result = this.getField(key).validate()

    return {
      fields: this.update(key, result.field),
      valid: result.valid,
    }
  }

  getField(key: string): FormField {
    const fieldKey = sanitizeKey(key)
    return this.fields[fieldKey]
  }

  get errors(): { [key: string]: ValidationResults } {
    return Object.keys(this.fields).reduce((errs, key) => {
      const field = this.fields[key]
      const errors = field.errors
      return errors.length > 0
        ? prop.set(errs, field.key, field.errors, true)
        : errs
    }, {})
  }

  get values() {
    return Object.keys(this.fields).reduce((values, key) => {
      const field = this.fields[key]
      return prop.set(values, field.key, field.value, true)
    }, {})
  }

  get status(): FormStatus {
    return Object.keys(this.fields).reduce((status, key) => {
      return Math.max(status, this.fields[key].status)
    }, 0)
  }

  setValue(key: string, value: string): FormFields {
    const field = this.getField(key).setValue(value)
    return this.update(key, field)
  }

  setTransform(key: string, transformFn: TransformFn): FormFields {
    const field = this.getField(key).setTransform(transformFn)
    return this.update(key, field)
  }

  setValidation(key: string, validation: any): FormFields {
    const field = this.getField(key).setValidate(validation)
    return this.update(key, field)
  }

  setValidateOn(key: string, on: ValidateOnOpts): FormFields {
    const field = this.getField(key).setValidateOn(on)
    return this.update(key, field)
  }

  setGlobalValidateOn(on: ValidateOnOpts): FormFields {
    const fields = Object.keys(this.fields).reduce((newFields, key) => {
      const f = this.fields[key]
      return prop.set.mutate(newFields, key, f.setDefaultValidateOn(on))
    }, {})

    return new FormFields(this.defaults, on, fields)
  }

  setDefaults(defaults: MapStringAny): FormFields {
    return new FormFields(defaults, this.globalValidateOn, this.fields)
  }

  private update(key: string, field: FormField): FormFields {
    const fieldKey = sanitizeKey(key)

    return new FormFields(this.defaults, this.globalValidateOn, prop.set(
      this.fields,
      fieldKey,
      field
    ) as MapStringFormField)
  }
}
