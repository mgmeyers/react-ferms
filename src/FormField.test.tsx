import FormField from 'FormField'
import { FormFieldJSON, FormStatus, ValidationFn } from 'types'

const def: FormFieldJSON = {
  errors: ['1', '2'],
  key: 'a.b.c',
  status: FormStatus.DIRTY,
  transform: v => v,
  validate: v => true,
  validateOn: 'blur',
  value: 'hi',
}

describe('class FormField', () => {
  test('instantiates from form field definition', () => {
    let f = new FormField(def)

    expect(f.isValid).toBe(true)
    expect(f.errors).toEqual(def.errors)
    expect(f.status).toBe(def.status)
    expect(f.validateOn).toBe(def.validateOn)
    expect(f.value).toBe(def.value)
    expect(f.rawValue).toBe(def.value)

    f = new FormField({ key: 'wow' })

    expect(f.status).toBe(FormStatus.PRISTINE)
    expect(f.errors).toEqual([])
    expect(f.validateOn).toBe('submit')
    expect(f.value).toBe('')
    expect(f.rawValue).toBe('')
    expect(f.validate().valid).toBe(true)
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

  test('sets validate', () => {
    const validateMock = jest.fn(v => v)
    const f = new FormField(def)
    let u = f.setValidate(validateMock)

    expect(f).not.toBe(u)

    u = u.validate().field

    expect(validateMock).toHaveBeenCalled()
  })

  test('sets value', () => {
    const f = new FormField(def)
    const validateMock = jest.fn(v => v)

    let u = f.setValidate(validateMock)
    u = u.setValue('hey')

    expect(f).not.toBe(u)
    expect(f.value).not.toBe(u.value)
    expect(validateMock).not.toHaveBeenCalled()

    u = u.setValidateOn('change')
    u = u.setValue('hey2')
    expect(validateMock).toHaveBeenCalledWith('hey2')
  })

  test('sets transform', () => {
    const mock = jest.fn(v => v.toUpperCase())
    const f = new FormField(def)
    const u = f.setTransform(mock)

    expect(f).not.toBe(u)
    expect(u.value).toBe('HI')
    expect(mock).toHaveBeenCalledWith('hi')
  })

  test('validates', () => {
    const validate: ValidationFn = v => (v === 'hi' ? true : ['error'])
    let f = new FormField(def).setValidate(validate)
    let res = f.validate()

    expect(res.valid).toBe(true)
    expect(res.field).not.toBe(f)
    expect(res.field.errors).toEqual([])

    f = res.field.setValue('nope')
    res = f.validate()

    expect(res.valid).toBe(false)
    expect(res.field).not.toBe(f)
    expect(res.field.errors).toEqual(['error'])
  })
})
