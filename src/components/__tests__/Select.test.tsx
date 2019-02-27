import { mount } from 'enzyme'
import * as React from 'react'

import Form from 'components/Form'
import Select from 'components/Select'

import { noop } from 'helpers'

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

    const TestComp = (p: { validateOn: 'submit' | 'blur' }) => {
      return (
        <Form defaults={{ test: 'one' }} onSubmit={noop}>
          <Select
            name="test"
            onBlur={onBlur}
            validate={mock}
            validateOn={p.validateOn}
          >
            <option value="one">One</option>
            <option value="two">Two</option>
          </Select>
        </Form>
      )
    }

    const s = mount(<TestComp validateOn="submit" />)

    s.find('select').simulate('blur')

    expect(mock).not.toHaveBeenCalled()
    expect(onBlur).toHaveBeenCalled()

    s.setProps({ validateOn: 'blur' })
    s.find('select').simulate('blur')

    expect(mock).toHaveBeenCalledWith('one')
  })

  test('handles change event', () => {
    const mock = jest.fn(v => true)
    const onChange = jest.fn()

    const s = mount(
      <Form onSubmit={noop} validateOn="change">
        <Select name="test" onChange={onChange} validate={mock}>
          <option value="one">one</option>
        </Select>
      </Form>
    )

    s.find('select').simulate('change', { target: { value: 'hi' } })

    expect(mock).toHaveBeenCalledWith('hi')
    expect(onChange).toHaveBeenCalled()
  })

  test('handles multi-value change event', () => {
    const mock = jest.fn()
    const onChange = jest.fn()

    const s = mount(
      <Form onSubmit={noop} validateOn="change">
        <Select onChange={onChange} name="test" multiple validate={mock}>
          <option value="one">One</option>
          <option value="two">Two</option>
          <option value="three">Three</option>
        </Select>
      </Form>
    )

    s.find('select').simulate('change', {
      target: {
        options: [
          { selected: true, value: 'one' },
          { selected: false, value: 'two' },
          { selected: true, value: 'three' },
        ],
      },
    })

    expect(mock).toHaveBeenCalledWith(['one', 'three'])
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
