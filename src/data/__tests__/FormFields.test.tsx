import FormFields from 'data/FormFields'
import { FormStatus } from 'types'

describe('class FormFields', () => {
  test('instantiates', () => {
    const f = new FormFields({})

    expect(f.values).toEqual({})
    expect(f.errors).toEqual({})
    expect(f.status).toBe(FormStatus.PRISTINE)
  })

  test('adds fields', () => {
    const f = new FormFields({})
    let u = f.add({ key: 'a.b' })

    expect(f).not.toBe(u)
    expect(u.values).toEqual({
      a: {
        b: '',
      },
    })
    expect(u.status).toBe(FormStatus.PRISTINE)

    u = u.add({ key: 'a.c', value: 'test' })

    expect(u.values).toEqual({
      a: {
        b: '',
        c: 'test',
      },
    })
    expect(u.status).toBe(FormStatus.DIRTY)

    u = u.add({ key: 'a.d', value: 'test', transform: v => v.toUpperCase() })

    expect(u.values).toEqual({
      a: {
        b: '',
        c: 'test',
        d: 'TEST',
      },
    })
    expect(u.status).toBe(FormStatus.DIRTY)
  })

  test('removes fields', () => {
    const f = new FormFields({})
    let u = f.add({ key: 'a.b' }).add({ key: 'a.c' })

    u = u.remove('a.b')

    expect(f).not.toBe(u)
    expect(u.values).toEqual({
      a: {
        c: '',
      },
    })

    u = u.remove('a.c')
    expect(u.values).toEqual({})
  })

  test('validates', () => {
    const f = new FormFields({})
    const validate = (v: any) => {
      return v === 'one' ? ['nope'] : true
    }
    let u = f
      .add({ key: 'a.b', value: 'one', validate })
      .add({ key: 'a.c', value: 'two', validate })

    let res = u.validate()

    expect(res.valid).toBe(false)
    expect(res.fields.errors).toEqual({
      a: {
        b: ['nope'],
      },
    })

    u = res.fields.setValue('a.b', 'three')

    res = u.validate()

    expect(res.valid).toBe(true)
    expect(res.fields.errors).toEqual({})
  })

  test('validates individual field', () => {
    const mockValidation = jest.fn((v: any) => ['nope'])
    const f = new FormFields({}).add({
      key: 'a',
      validate: mockValidation,
      value: '123',
    })

    const res = f.validateField('a')

    expect(res.valid).toBe(false)
    expect(mockValidation).toHaveBeenCalled()
    expect(res.fields.status).toBe(FormStatus.INVALID)
  })

  test('gets field', () => {
    const f = new FormFields({}).add({ key: 'a', value: '123' })
    expect(f.getField('a').value).toBe('123')
  })

  test('gets field values', () => {
    const f = new FormFields({})
      .add({ key: 'a' })
      .add({ key: 'b.c', value: 'd' })

    expect(f.values).toEqual({
      a: '',
      b: {
        c: 'd',
      },
    })
  })

  test('gets status from fields', () => {
    let f = new FormFields({})

    f = f.add({ key: 'a' })

    expect(f.status).toBe(FormStatus.PRISTINE)

    f = f.add({ key: 'b', value: 'hi' })

    expect(f.status).toBe(FormStatus.DIRTY)

    f = f.add({
      key: 'c',
      validate: (v: any) => v,
      validateOn: 'change',
      value: 'hi2',
    })
    f = f.setValue('c', 'hi3')

    expect(f.status).toBe(FormStatus.INVALID)
  })

  test('gets field errors', () => {
    const validate = (v: any) => [v]
    let f = new FormFields({ validateOn: 'change' })

    f = f
      .add({ key: 'a', validate })
      .add({ key: 'b', validate })
      .add({ key: 'c' })

    f = f
      .setValue('a', 'hi')
      .setValue('b', 'hi2')
      .setValue('c', 'hi3')

    expect(f.errors).toEqual({
      a: ['hi'],
      b: ['hi2'],
    })
  })

  test('sets value', () => {
    let f = new FormFields({})
    f = f.add({ key: 'a.b', value: 'one' }).add({ key: 'a.c', value: 'two' })

    expect(f.values).toEqual({
      a: {
        b: 'one',
        c: 'two',
      },
    })

    const u = f.setValue('a.b', 'three')

    expect(f).not.toBe(u)
    expect(u.values).toEqual({
      a: {
        b: 'three',
        c: 'two',
      },
    })
  })

  test('sets transform', () => {
    const transformMock = jest.fn(v => `${v} hi`)
    const transformMock2 = jest.fn(v => `${v} hi2`)
    let f = new FormFields({})

    f = f.add({ key: 'a', value: 'hi', transform: transformMock })

    expect(f.getField('a').value).toBe('hi hi')

    f = f.setTransform('a', transformMock2)

    expect(f.getField('a').value).toBe('hi hi2')

    expect(transformMock).toHaveBeenCalledTimes(1)
    expect(transformMock2).toHaveBeenCalledTimes(1)
  })

  test('sets validation', () => {
    const validationMock = jest.fn(v => true)
    const validationMock2 = jest.fn(v => true)
    let f = new FormFields({ validateOn: 'change' })

    f = f.add({ key: 'a', validate: validationMock }).setValue('a', 'hi')

    f = f.setValidation('a', validationMock2)

    f = f.setValue('a', 'hi2')

    expect(validationMock).toHaveBeenCalledTimes(1)
    expect(validationMock2).toHaveBeenCalledTimes(1)
  })

  test('sets validationOn', () => {
    const validationMock = jest.fn(v => true)
    let f = new FormFields({ validateOn: 'submit' })

    f = f
      .add({ key: 'a', validate: validationMock, validateOn: 'blur' })
      .setValue('a', 'hi')

    expect(validationMock).not.toHaveBeenCalled()

    f = f.setValidateOn('a', 'change')

    f = f.setValue('a', 'hi2')

    expect(validationMock).toHaveBeenCalled()
  })

  test('sets validation strategy', () => {
    const stratMock = jest.fn((v: any, fn: any) => {
      return fn(v)
    })

    let f = new FormFields({})
      .add({ key: 'a', value: 'b' })
      .add({ key: 'v', value: 'c' })

    f = f.validate().fields
    f = f.setValidationStrategy(stratMock)
    f = f.validate().fields

    expect(stratMock).toHaveBeenCalledTimes(2)
  })

  test('sets default validationOn', () => {
    const validationMock = jest.fn(v => true)
    let f = new FormFields({ validateOn: 'submit' })

    f = f.add({ key: 'a', validate: validationMock }).setValue('a', 'hi')

    expect(validationMock).not.toHaveBeenCalled()

    f = f.setDefaultValidateOn('change')

    f = f
      .add({ key: 'b', validate: validationMock, validateOn: 'blur' })
      .setValue('b', 'hi')

    expect(validationMock).not.toHaveBeenCalled()

    f = f.setValue('a', 'hi2')

    expect(validationMock).toHaveBeenCalled()
  })

  test('uses defaults', () => {
    let f = new FormFields({ defaults: { a: { b: 'c' } } })

    expect(f.values).toEqual({})

    f = f.add({ key: 'a.b' })

    expect(f.values).toEqual({ a: { b: 'c' } })

    f = f.setDefaults({ a: { d: 'e' } })

    expect(f.values).toEqual({ a: { b: 'c' } })

    f = f.add({ key: 'a.d' })

    expect(f.values).toEqual({ a: { b: 'c', d: 'e' } })
  })
})
