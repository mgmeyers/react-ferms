import * as React from 'react'
import { shallow } from 'enzyme'

import Form from './Form'

const noop = (): void => void 0

describe('<Form />', () => {
  test('should mount', () => {
    const s = shallow(<Form onSubmit={noop} />)
    expect(shallow(<Form onSubmit={noop} />).find('form').length).toBe(1)
  })

  test('should add fields', () => {
    const s = shallow(<Form onSubmit={noop} />).instance() as Form

    s.add({ key: 'a' })
    s.add({ key: 'b', value: 'c' })

    expect(s.state.fields.values).toEqual({
      a: '',
      b: 'c',
    })
  })

  test('should remove fields', () => {
    const s = shallow(<Form onSubmit={noop} />).instance() as Form

    s.add({ key: 'a' })
    s.add({ key: 'b', value: 'c' })
    s.remove('a')

    expect(s.state.fields.values).toEqual({
      b: 'c',
    })
  })

  test('should validate field', () => {
    const mock = jest.fn(v => true)
    const s = shallow(<Form onSubmit={noop} />).instance() as Form

    s.add({ key: 'a', validate: mock })
    s.validateField('a')

    expect(mock).toHaveBeenCalled()
  })

  test('should set field value', () => {
    const s = shallow(<Form onSubmit={noop} />).instance() as Form

    s.add({ key: 'a' })
    s.setValue('a', 'b')

    expect(s.state.fields.values).toEqual({
      a: 'b',
    })
  })

  test('should set field validation', () => {
    const mock = jest.fn(v => true)
    const s = shallow(<Form onSubmit={noop} />).instance() as Form

    s.add({ key: 'a' })
    s.setValidation('a', mock)
    s.validateField('a')

    expect(mock).toHaveBeenCalled()
  })

  test('should set field validateOn', () => {
    const mock = jest.fn(v => true)
    const s = shallow(<Form onSubmit={noop} />).instance() as Form

    s.add({ key: 'a' })
    s.setValidation('a', mock)
    s.setValidateOn('a', 'change')
    s.setValue('a', 'hi')

    expect(mock).toHaveBeenCalled()
  })

  test('should set field transform', () => {
    const mock = jest.fn(v => v)
    const s = shallow(<Form onSubmit={noop} />).instance() as Form

    s.add({ key: 'a' })
    s.setTransform('a', mock)

    const _ = s.state.fields.getField('a').value

    expect(mock).toHaveBeenCalled()
  })

  test('should respond to prop changes', () => {
    const stratMock = jest.fn((v: any, fn: any) => {
      return fn(v)
    })
    const validate = jest.fn(v => true)
    const s = shallow(<Form onSubmit={noop} />)
    const i = s.instance() as Form

    s.setProps({
      defaults: { a: 'b' },
      validateOn: 'change',
      validationStrategy: stratMock,
    })

    i.add({ key: 'a', validate })

    expect(i.state.fields.values).toEqual({ a: 'b' })

    i.setValue('a', 'hi')

    expect(i.state.fields.getField('a').field.validationStrategy).toBe(
      stratMock
    )

    expect(validate).toHaveBeenCalled()
    expect(stratMock).toHaveBeenCalled()
    expect(i.state.fields.values).toEqual({ a: 'hi' })
  })

  test('should handle submit', () => {
    const submit = jest.fn()
    const error = jest.fn()
    const preValidate = jest.fn()
    const s = shallow(
      <Form onError={error} onSubmit={submit} preValidate={preValidate} />
    )
    const i = s.instance() as Form

    i.add({ key: 'a', value: 'b' })

    s.find('form').simulate('submit', { preventDefault: noop })

    expect(submit).toHaveBeenCalledWith({ a: 'b' })
    expect(preValidate).toHaveBeenCalled()

    i.add({ key: 'b', value: 'c', validate: () => ['nope'] })

    s.find('form').simulate('submit', { preventDefault: noop })

    expect(error).toHaveBeenCalledWith({
      b: ['nope'],
    })
  })
})
