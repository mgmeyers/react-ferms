import { mount } from 'enzyme'
import * as React from 'react'

import Form from 'components/Form'
import Textarea from 'components/Textarea'

import { noop } from 'helpers'

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
    const mock = jest.fn(() => true)
    const onBlur = jest.fn()

    const TestComp = (p: { validateOn: 'submit' | 'blur' }) => {
      return (
        <Form defaults={{ test: 'hi' }} onSubmit={noop}>
          <Textarea
            name="test"
            onBlur={onBlur}
            validate={mock}
            validateOn={p.validateOn}
          />
        </Form>
      )
    }

    const s = mount(<TestComp validateOn="submit" />)

    s.find('textarea').simulate('blur')

    expect(mock).not.toHaveBeenCalled()
    expect(onBlur).toHaveBeenCalled()

    s.setProps({ validateOn: 'blur' })
    s.find('textarea').simulate('blur')

    expect(mock).toHaveBeenCalledWith('hi')
  })

  test('handles change event', () => {
    const mock = jest.fn(v => true)
    const onChange = jest.fn()

    const s = mount(
      <Form onSubmit={noop} validateOn="change">
        <Textarea name="test" onChange={onChange} validate={mock} />
      </Form>
    )

    s.find('textarea').simulate('change', { target: { value: 'hi' } })

    expect(mock).toHaveBeenCalledWith('hi')
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
