import FormField from 'data/FormField'
import { FormFieldJSON, FormStatus } from 'types'

import defaultValidationStrat from 'validation-strategies/default'

const def: FormFieldJSON = {
  defaultValidateOn: 'submit',
  errors: ['1', '2'],
  key: 'a.b.c',
  status: FormStatus.DIRTY,
  transform: v => v,
  validate: () => true,
  validateOn: 'blur',
  validationStrategy: defaultValidationStrat,
  value: 'hi',
}

describe('class FormField', () => {
  test('instantiates from form field definition', async () => {
    let f = new FormField(def)

    expect(f.isValid).toBe(true)
    expect(f.errors).toEqual(def.errors)
    expect(f.status).toBe(def.status)
    expect(f.validateOn).toBe(def.validateOn)
    expect(f.value).toBe(def.value)
    expect(f.rawValue).toBe(def.value)

    f = new FormField({
      defaultValidateOn: 'submit',
      key: 'wow',
      validationStrategy: defaultValidationStrat,
    })

    expect(f.status).toBe(FormStatus.PRISTINE)
    expect(f.errors).toEqual([])
    expect(f.validateOn).toBe('submit')
    expect(f.value).toBe('')
    expect(f.rawValue).toBe('')
    expect((await f.validate().promise).valid).toBe(true)

    f = new FormField({
      defaultValidateOn: 'submit',
      key: 'wow',
      multiple: true,
      validationStrategy: defaultValidationStrat,
    })

    expect(f.rawValue).toEqual([])
  })

  test('sets key', () => {
    const f = new FormField(def)
    const u = f.setKey('c.b.a')

    expect(f).not.toBe(u)
    expect(f.key).not.toBe(u.key)
  })

  test('sets validateOn', () => {
    const f = new FormField(def)
    const u = f.setValidateOn('submit')

    expect(f).not.toBe(u)
    expect(f.validateOn).not.toBe(u.validateOn)
  })

  test('sets defaultValidateOn', () => {
    let f = new FormField({
      defaultValidateOn: 'submit',
      key: 'a.b.c',
      validationStrategy: defaultValidationStrat,
    })

    f = f.setValue('pow')

    const u = f.setDefaultValidateOn('change')

    expect(u.validateOn).toBe('change')
  })

  test('sets validate', async () => {
    const validateMock = jest.fn(v => v)
    const f = new FormField(def)
    let u = f.setValidate(validateMock)

    expect(f).not.toBe(u)

    u = (await u.validate()).field

    expect(validateMock).toHaveBeenCalled()
  })

  test('sets validationStrategy', () => {
    const stratMock = jest.fn((v, fn) => fn(v))
    const f = new FormField(def)
    const u = f.setValidationStrategy(stratMock)

    expect(f).not.toBe(u)
    u.validate()

    expect(stratMock).toHaveBeenCalled()
  })

  test('sets value', () => {
    const f = new FormField(def)

    let u = f.setValue('hey')

    expect(f).not.toBe(u)
    expect(f.value).not.toBe(u.value)

    u = u.setValidateOn('change')
    u = u.setValue('hey2')
  })

  test('sets transform', () => {
    const mock = jest.fn(v => v.toUpperCase())
    const f = new FormField(def)
    const u = f.setTransform(mock)

    expect(f).not.toBe(u)
    expect(u.value).toBe('HI')
    expect(mock).toHaveBeenCalledWith('hi')
  })

  test('validates', async () => {
    const validate = (v: any) => (v === 'hi' ? true : ['error'])
    let f = new FormField(def).setValidate(validate)
    let res = await f.validate().promise

    expect(res.valid).toBe(true)
    expect(res.field).not.toBe(f)
    expect(res.field.errors).toEqual([])

    f = res.field.setValue('nope')
    res = await f.validate().promise

    expect(res.valid).toBe(false)
    expect(res.field).not.toBe(f)
    expect(res.field.errors).toEqual(['error'])
  })
})
