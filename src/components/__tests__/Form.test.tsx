import { shallow } from 'enzyme'
import * as React from 'react'
import { act, cleanup, renderHook } from 'react-hooks-testing-library'

import Form from 'components/Form'
import { noop } from 'helpers'
import { useFormState } from 'hooks/form'
import { FormProps, IFormContext } from 'types'

describe('<Form />', () => {
  afterEach(cleanup)

  test('should mount', () => {
    const s = shallow(<Form onSubmit={noop} />)
    expect(s.find('form').length).toBe(1)
  })

  test('should add fields', () => {
    const { result } = renderHook(() => useFormState({ onSubmit: noop }))

    act(() => result.current.context.add({ key: 'a' }))
    act(() => result.current.context.add({ key: 'b', value: 'c' }))

    expect(result.current.context.fields.values).toEqual({
      a: '',
      b: 'c',
    })
  })

  test('should remove fields', () => {
    const { result } = renderHook(() => useFormState({ onSubmit: noop }))

    act(() => result.current.context.add({ key: 'a' }))
    act(() => result.current.context.add({ key: 'b', value: 'c' }))
    act(() => result.current.context.remove('a'))

    expect(result.current.context.fields.values).toEqual({
      b: 'c',
    })
  })

  test('should validate field', () => {
    const mock = jest.fn(v => true)

    const { result } = renderHook(() => useFormState({ onSubmit: noop }))

    act(() => result.current.context.add({ key: 'a', validate: mock }))
    act(() => result.current.context.validateField('a'))

    expect(mock).toHaveBeenCalled()
  })

  test('should set field value', () => {
    const { result } = renderHook(() => useFormState({ onSubmit: noop }))

    act(() => result.current.context.add({ key: 'a' }))
    act(() => result.current.context.setValue('a', 'b'))

    expect(result.current.context.fields.values).toEqual({
      a: 'b',
    })
  })

  test('should set field validation', () => {
    const mock = jest.fn(v => true)
    const { result } = renderHook(() => useFormState({ onSubmit: noop }))

    act(() => result.current.context.add({ key: 'a' }))
    act(() => result.current.context.setValidation('a', mock))
    act(() => result.current.context.validateField('a'))

    expect(mock).toHaveBeenCalled()
  })

  test('should set field validateOn', () => {
    const mock = jest.fn(v => true)
    const { result } = renderHook(() => useFormState({ onSubmit: noop }))

    act(() => result.current.context.add({ key: 'a' }))
    act(() => result.current.context.setValidation('a', mock))
    act(() => result.current.context.setValidateOn('a', 'change'))
    act(() => result.current.context.setValue('a', 'hi'))

    expect(mock).toHaveBeenCalled()
  })

  test('should set field transform', () => {
    const mock = jest.fn(v => v)
    const { result } = renderHook(() => useFormState({ onSubmit: noop }))

    act(() => result.current.context.add({ key: 'a' }))
    act(() => result.current.context.setTransform('a', mock))

    const _ = result.current.context.fields.getField('a').value

    expect(mock).toHaveBeenCalled()
  })

  test('should respond to prop changes', () => {
    const stratMock = jest.fn((v: any, fn: any) => {
      return fn(v)
    })
    const validate = jest.fn(v => true)

    const { rerender, result } = renderHook<
      FormProps,
      { context: IFormContext }
    >(p => useFormState(p), {
      initialProps: { onSubmit: noop },
    })

    const ctx1 = result.current.context.fields

    rerender({
      defaults: { a: 'b' },
      onSubmit: noop,
      validateOn: 'change',
      validationStrategy: stratMock,
    })

    expect(ctx1).not.toBe(result.current.context.fields)

    act(() => result.current.context.add({ key: 'a', validate }))

    expect(result.current.context.fields.values).toEqual({ a: 'b' })

    act(() => result.current.context.setValue('a', 'hi'))

    expect(result.current.context.fields.getField('a').validationStrategy).toBe(
      stratMock
    )
    expect(validate).toHaveBeenCalled()
    expect(stratMock).toHaveBeenCalled()
    expect(result.current.context.fields.values).toEqual({ a: 'hi' })
  })

  test('should handle onSubmit', () => {
    const submit = jest.fn()
    const error = jest.fn()
    const preValidate = jest.fn()

    const { result } = renderHook(p => useFormState(p), {
      initialProps: { onError: error, onSubmit: submit, preValidate },
    })

    act(() => result.current.context.add({ key: 'a', value: 'b' }))

    const mockEvt = { preventDefault: noop } as React.FormEvent<HTMLFormElement>

    act(() => result.current.onSubmit(mockEvt))

    expect(submit).toHaveBeenCalledWith({ a: 'b' })
    expect(preValidate).toHaveBeenCalled()

    act(() =>
      result.current.context.add({
        key: 'b',
        validate: () => ['nope'],
        value: 'c',
      })
    )

    act(() => result.current.onSubmit(mockEvt))

    expect(error).toHaveBeenCalledWith({
      b: ['nope'],
    })
  })
})
