import * as prop from 'prop-ops'

import FormField from 'data/FormField'

import { sanitizeKey } from 'helpers'
import defaultValidationStrat from 'validation-strategies/default'

import {
  AddFieldOpts,
  FormFieldsOptions,
  FormFieldsValidation,
  FormFieldValidation,
  FormStatus,
  MapStringAny,
  MapStringFormField,
  TransformFn,
  ValidateOnOpts,
  ValidationResults,
  ValidationStrategy,
} from 'types'

export default class FormFields {
  private options: FormFieldsOptions

  constructor(opts: FormFieldsOptions) {
    this.options = {
      defaults: opts.defaults || {},
      fields: opts.fields || {},
      validateOn: opts.validateOn || 'submit',
      validationStrategy: opts.validationStrategy || defaultValidationStrat,
    }
  }

  add(opts: AddFieldOpts): FormFields {
    if (opts.multiple && this.getField(opts.key) !== undefined) {
      return this
    }

    const status = !opts.value ? FormStatus.PRISTINE : FormStatus.DIRTY
    const globalOpts = this.options

    const field = new FormField({
      defaultValidateOn: globalOpts.validateOn,
      key: opts.key,
      multiple: opts.multiple,
      status,
      transform: opts.transform,
      validate: opts.validate,
      validateOn: opts.validateOn,
      validationStrategy: globalOpts.validationStrategy,
      value: opts.value || prop.get(globalOpts.defaults, opts.key, ''),
    })

    return this.update(opts.key, field)
  }

  remove(key: string): FormFields {
    const { options } = this
    return new FormFields(
      prop.set(options, 'fields', prop.del(options.fields, sanitizeKey(key)))
    )
  }

  validate() {
    const {
      options: { fields: currentFields },
    } = this

    const fields: MapStringFormField = {}
    const promises: Array<Promise<FormFieldValidation>> = []

    const fieldKeys = Object.keys(currentFields)

    fieldKeys.forEach(k => {
      const res = currentFields[k].validate()
      fields[k] = res.field
      promises.push(res.promise)
    })

    return {
      fields: new FormFields(prop.set(this.options, 'fields', fields)),
      promise: this.validateAsync(fieldKeys, promises),
    }
  }

  async validateAsync(
    keys: string[],
    promises: Array<Promise<FormFieldValidation>>
  ): Promise<FormFieldsValidation> {
    let valid = true

    const fields = (await Promise.all(promises)).reduce<MapStringFormField>(
      (results, res, i) => {
        if (!res.valid) {
          valid = false
        }

        results[keys[i]] = res.field

        return results
      },
      {}
    )

    return {
      fields: new FormFields(prop.set(this.options, 'fields', fields)),
      valid,
    }
  }

  validateField(key: string) {
    const result = this.getField(key).validate()

    return {
      fields: this.update(key, result.field),
      promise: this.validateFieldAsync(key, result.promise),
    }
  }

  async validateFieldAsync(
    key: string,
    promise: Promise<FormFieldValidation>
  ): Promise<FormFieldsValidation> {
    const result = await promise

    return {
      fields: this.update(key, result.field),
      valid: result.valid,
    }
  }

  getField(key: string): FormField {
    const fieldKey = sanitizeKey(key)
    return this.options.fields[fieldKey]
  }

  get values(): MapStringAny {
    const {
      options: { fields },
    } = this

    return Object.keys(fields).reduce((values, key) => {
      const field = fields[key]
      return prop.set(values, field.key, field.value, true)
    }, {})
  }

  get status(): FormStatus {
    const {
      options: { fields },
    } = this

    return Object.keys(fields).reduce((status, key) => {
      return Math.max(status, fields[key].status)
    }, 0)
  }

  get errors(): { [key: string]: ValidationResults } {
    const {
      options: { fields },
    } = this

    return Object.keys(fields).reduce((errs, key) => {
      const field = fields[key]
      const errors = field.errors
      return errors.length > 0
        ? prop.set(errs, field.key, field.errors, true)
        : errs
    }, {})
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

  setValidationStrategy(validationStrategy: ValidationStrategy) {
    const strat = validationStrategy || defaultValidationStrat
    const {
      options: { fields: currentFields },
    } = this

    const fields = Object.keys(currentFields).reduce((newFields, key) => {
      const f = currentFields[key]
      return prop.set.mutate(newFields, key, f.setValidationStrategy(strat))
    }, {})

    return new FormFields({
      ...this.options,
      fields,
      validationStrategy: strat,
    })
  }

  setDefaultValidateOn(validateOn: ValidateOnOpts): FormFields {
    const {
      options: { fields: currentFields },
    } = this

    const on = validateOn || 'submit'

    const fields = Object.keys(currentFields).reduce((newFields, key) => {
      const f = currentFields[key]
      return prop.set.mutate(newFields, key, f.setDefaultValidateOn(on))
    }, {})

    return new FormFields({ ...this.options, validateOn: on, fields })
  }

  setDefaults(defaults: MapStringAny): FormFields {
    return new FormFields(prop.set(this.options, 'defaults', defaults || {}))
  }

  private update(key: string, field: FormField): FormFields {
    const fieldKey = sanitizeKey(key)
    return new FormFields(prop.set(this.options, `fields.${fieldKey}`, field))
  }
}
