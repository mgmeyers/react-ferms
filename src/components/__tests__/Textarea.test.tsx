import * as React from 'react'
import { mount, shallow } from 'enzyme'

import Form from 'components/Form'
import Textarea, { FormTextarea } from 'components/Textarea'
import FormFields from 'data/FormFields'

import { noop } from 'helpers'

const defaultCtx = {
  add: noop,
  fields: new FormFields({}),
  remove: noop,
  setTransform: noop,
  setValidateOn: noop,
  setValidation: noop,
  setValue: noop,
  validateField: noop,
}

describe('<Textarea />', () => {
  test('should mount', () => {
    const s = mount(
      <Form onSubmit={noop}>
        <Textarea name="test" />
      </Form>
    )

    expect(s.find('textarea').length).toBe(1)
  })

  test('handles blur event', () => {
    const mock = jest.fn()
    const onBlur = jest.fn()

    const s = shallow(
      <FormTextarea
        onBlur={onBlur}
        name="test"
        context={{
          ...defaultCtx,
          validateField: mock,
        }}
      />
    )

    const i = s.instance() as FormTextarea

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
      <FormTextarea
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

  test('returns correct value on form submit', () => {
    const onSubmit = jest.fn()
    const s = mount(
      <Form onSubmit={onSubmit}>
        <Textarea name="test" transform={(v: string) => v + v.toUpperCase()} />
      </Form>
    )

    s.find('textarea').simulate('change', { target: { value: 'hi' } })
    s.find('form').simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith({ test: 'hiHI' })
  })
})
