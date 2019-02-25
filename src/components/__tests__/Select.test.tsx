import { mount, shallow } from 'enzyme'
import * as React from 'react'

import Form from 'components/Form'
import Select, { FormSelect } from 'components/Select'

import { noop } from 'helpers'
import { defaultCtx } from './common'

describe('<Select />', () => {
  test('should mount', () => {
    const s = mount(
      <Form onSubmit={noop}>
        <Select name="test">
          <option value="one">One</option>
          <option value="two">Two</option>
        </Select>
      </Form>
    )

    expect(s.find('select').length).toBe(1)
  })

  test('handles blur event', () => {
    const mock = jest.fn()
    const onBlur = jest.fn()

    const s = shallow(
      <FormSelect
        onBlur={onBlur}
        name="test"
        context={{
          ...defaultCtx,
          validateField: mock,
        }}
      >
        <option value="one">One</option>
        <option value="two">Two</option>
      </FormSelect>
    )

    const i = s.instance() as FormSelect

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
      <FormSelect
        onChange={onChange}
        name="test"
        context={{
          ...defaultCtx,
          setValue: mock,
        }}
      >
        <option value="one">One</option>
        <option value="two">Two</option>
      </FormSelect>
    )

    s.simulate('change', { target: { value: 'hi' } })

    expect(mock).toHaveBeenCalledWith('test', 'hi')
    expect(onChange).toHaveBeenCalled()
  })

  test('handles multi-value change event', () => {
    const mock = jest.fn()
    const onChange = jest.fn()

    const s = shallow(
      <FormSelect
        onChange={onChange}
        name="test"
        multiple
        context={{
          ...defaultCtx,
          setValue: mock,
        }}
      >
        <option value="one">One</option>
        <option value="two">Two</option>
        <option value="three">Three</option>
      </FormSelect>
    )

    s.simulate('change', {
      target: {
        options: [
          { selected: true, value: 'one' },
          { selected: false, value: 'two' },
          { selected: true, value: 'three' },
        ],
      },
    })

    expect(mock).toHaveBeenCalledWith('test', ['one', 'three'])
    expect(onChange).toHaveBeenCalled()
  })

  test('returns correct value on form submit', () => {
    const onSubmit = jest.fn()
    const s = mount(
      <Form onSubmit={onSubmit}>
        <Select name="test" transform={(v: string) => v + v.toUpperCase()}>
          <option value="one">One</option>
          <option value="two">Two</option>
        </Select>
      </Form>
    )

    s.find('select').simulate('change', { target: { value: 'hi' } })
    s.find('form').simulate('submit')

    expect(onSubmit).toHaveBeenCalledWith({ test: 'hiHI' })
  })
})
