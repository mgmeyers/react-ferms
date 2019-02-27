import { mount } from 'enzyme'
import * as React from 'react'

import Form from 'components/Form'
import Input from 'components/Input'

import FormFields from 'data/FormFields'

import { noop } from 'helpers'
import { defaultCtx } from './common'

import { TransformFn, ValidateOnOpts } from 'types'

describe('<Input />', () => {
  test('should mount', () => {
    const s = mount(
      <Form onSubmit={noop}>
        <Input name="test" />
      </Form>
    )

    expect(s.find('input').length).toBe(1)
  })

  test('should respond to prop updates', () => {
    const transMock = jest.fn((v: string) => v + v)
    const validateMock = jest.fn(() => true)

    const TestComp = (p: {
      transform?: TransformFn
      validate?: any
      validateOn?: ValidateOnOpts
    }) => {
      return (
        <Form defaults={{ test: 'hi' }} onSubmit={noop}>
          <Input name="test" {...p} />
        </Form>
      )
    }

    const s = mount(<TestComp />)

    s.setProps({
      transform: transMock,
      validate: validateMock,
      validateOn: 'change',
    })

    s.find('input').simulate('change', { target: { value: 'hi' } })
    expect(transMock).toHaveBeenCalledWith('hi')
    expect(validateMock).toHaveBeenCalledWith('hihi')
  })

  test('removes field on unmount', () => {
    const mock = jest.fn()

    const TestComp = (p: { which: 0 | 1 }) => {
      return (
        <Form onSubmit={mock}>
          {p.which === 0 ? (
            <Input name="test" />
          ) : (
            <div>
              <Input name="test2" />
            </div>
          )}
        </Form>
      )
    }

    const s = mount(<TestComp which={0} />)

    s.find('input')
      .first()
      .simulate('change', { target: { value: 'hi' } })
    s.find('form').simulate('submit')

    expect(mock).toHaveBeenCalledWith({ test: 'hi' })

    s.setProps({ which: 1 })
    s.find('input')
      .first()
      .simulate('change', { target: { value: 'hey' } })

    s.find('form').simulate('submit')

    expect(mock).toHaveBeenCalledWith({ test2: 'hey' })
  })

  test('validates field', () => {
    const mock = jest.fn(() => true)

    const s = mount(
      <Form onSubmit={noop}>
        <Input name="test" validate={mock} validateOn="change" />
      </Form>
    )

    s.find('input').simulate('change', { target: { value: 'hi' } })

    expect(mock).toHaveBeenCalledWith('hi')
  })

  test('gets field value', () => {
    const s = mount(
      <Form onSubmit={noop}>
        <Input name="test" />
      </Form>
    )

    s.find('input').simulate('change', { target: { value: 'hi' } })

    expect(s.find('input').props().value).toBe('hi')
  })

  test('handles blur event', () => {
    const mock = jest.fn(() => true)
    const onBlur = jest.fn()

    const TestComp = (p: { validateOn: 'submit' | 'blur' }) => {
      return (
        <Form defaults={{ test: 'hi' }} onSubmit={noop}>
          <Input
            name="test"
            onBlur={onBlur}
            validate={mock}
            validateOn={p.validateOn}
          />
        </Form>
      )
    }

    const s = mount(<TestComp validateOn="submit" />)

    s.find('input').simulate('blur')

    expect(mock).not.toHaveBeenCalled()
    expect(onBlur).toHaveBeenCalled()

    s.setProps({ validateOn: 'blur' })
    s.find('input').simulate('blur')

    expect(mock).toHaveBeenCalledWith('hi')
  })

  test('handles change event', () => {
    const mock = jest.fn(v => true)
    const onChange = jest.fn()

    const s = mount(
      <Form onSubmit={noop} validateOn="change">
        <Input name="test" onChange={onChange} validate={mock} />
      </Form>
    )

    s.find('input').simulate('change', { target: { value: 'hi' } })

    expect(mock).toHaveBeenCalledWith('hi')
    expect(onChange).toHaveBeenCalled()
  })

  test('handles checkbox inputs', () => {
    const onSubmit = jest.fn()

    const s = mount(
      <Form onSubmit={onSubmit}>
        <Input name="test" type="checkbox" value="one" />
        <Input name="test" type="checkbox" value="two" />
      </Form>
    )

    s.find('input')
      .first()
      .simulate('change', {
        target: { value: 'one', checked: true },
      })

    s.find('form').simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith({
      test: ['one'],
    })

    s.find('input')
      .last()
      .simulate('change', {
        target: { value: 'two', checked: true },
      })

    s.find('form').simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith({
      test: ['one', 'two'],
    })

    s.find('input')
      .first()
      .simulate('change', {
        target: { value: 'one', checked: false },
      })

    s.find('form').simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith({
      test: ['two'],
    })

    s.find('input')
      .last()
      .simulate('change', {
        target: { value: 'two', checked: false },
      })

    s.find('form').simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith({
      test: [],
    })
  })

  test('returns correct value on form submit', () => {
    const onSubmit = jest.fn()
    const s = mount(
      <Form onSubmit={onSubmit}>
        <Input name="test" transform={(v: string) => v + v.toUpperCase()} />
      </Form>
    )

    s.find('input').simulate('change', { target: { value: 'hi' } })
    s.find('form').simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith({ test: 'hiHI' })
  })
})
