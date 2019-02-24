import * as React from 'react'
import { mount, shallow } from 'enzyme'

import Form from 'components/Form'
import Input, { FormInput } from 'components/Input'
import FormFields from 'data/FormFields'

import { noop } from 'helpers'
import { defaultCtx } from './common'

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
    const transMock = jest.fn()
    const validateMock = jest.fn()
    const validateOnMock = jest.fn()

    const s = shallow(
      <FormInput
        name="test"
        context={{
          ...defaultCtx,
          setTransform: transMock,
          setValidateOn: validateOnMock,
          setValidation: validateMock,
        }}
      />
    )

    const t = () => 0
    const v = () => 0
    const vo = () => 0

    s.setProps({ transform: t })
    s.setProps({ validate: v })
    s.setProps({ validateOn: vo })

    expect(transMock).toHaveBeenCalledTimes(1)
    expect(transMock).toHaveBeenCalledWith('test', t)

    expect(validateMock).toHaveBeenCalledTimes(1)
    expect(validateMock).toHaveBeenCalledWith('test', v)

    expect(validateOnMock).toHaveBeenCalledTimes(1)
    expect(validateOnMock).toHaveBeenCalledWith('test', vo)
  })

  test('removes field on unmount', () => {
    const mock = jest.fn()

    const s = shallow(
      <FormInput
        name="test"
        context={{
          ...defaultCtx,
          remove: mock,
        }}
      />
    )

    s.unmount()

    expect(mock).toHaveBeenCalledWith('test')
  })

  test('validates field', () => {
    const mock = jest.fn()

    const s = shallow(
      <FormInput
        name="test"
        context={{
          ...defaultCtx,
          validateField: mock,
        }}
      />
    )

    const i = s.instance() as FormInput

    i.validate()

    expect(mock).toHaveBeenCalledWith('test')
  })

  test('sets field value', () => {
    const mock = jest.fn()

    const s = shallow(
      <FormInput
        name="test"
        context={{
          ...defaultCtx,
          setValue: mock,
        }}
      />
    )

    const i = s.instance() as FormInput

    i.setValue('hi')

    expect(mock).toHaveBeenCalledWith('test', 'hi')
  })

  test('gets field value', () => {
    const fields = new FormFields({}).add({ key: 'test', value: 'testValue' })

    const s = shallow(
      <FormInput
        name="test"
        context={{
          ...defaultCtx,
          fields,
        }}
      />
    )

    const i = s.instance() as FormInput

    expect(i.value).toBe('testValue')
  })

  test('gets field raw value', () => {
    const fields = new FormFields({}).add({
      key: 'test',
      transform: (v: string) => v.toUpperCase(),
      value: 'testValue',
    })

    let s = shallow(
      <FormInput
        name="test"
        context={{
          ...defaultCtx,
          fields,
        }}
      />
    )

    let i = s.instance() as FormInput

    expect(i.rawValue).toBe('testValue')

    s = shallow(<FormInput name="test" context={defaultCtx} />)

    i = s.instance() as FormInput

    expect(i.rawValue).toBe('')
  })

  test('handles blur event', () => {
    const mock = jest.fn()
    const onBlur = jest.fn()

    const s = shallow(
      <FormInput
        onBlur={onBlur}
        name="test"
        context={{
          ...defaultCtx,
          validateField: mock,
        }}
      />
    )

    const i = s.instance() as FormInput

    s.simulate('blur')

    expect(mock).not.toHaveBeenCalled()
    expect(onBlur).toHaveBeenCalled()

    s.setProps({ validateOn: 'blur' })
    s.simulate('blur')

    expect(mock).toHaveBeenCalledWith('test')
  })

  test('handles change event', () => {
    const mock = jest.fn()
    const onChange = jest.fn()

    const s = shallow(
      <FormInput
        onChange={onChange}
        name="test"
        context={{
          ...defaultCtx,
          setValue: mock,
        }}
      />
    )

    s.simulate('change', { target: { value: 'hi' } })

    expect(mock).toHaveBeenCalledWith('test', 'hi')
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
