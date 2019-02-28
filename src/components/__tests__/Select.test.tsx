import * as React from 'react'
import { cleanup, fireEvent, render } from 'react-testing-library'

import Form from 'components/Form'
import Select from 'components/Select'

import { noop } from 'helpers'

describe('<Select />', () => {
  afterEach(cleanup)

  test('should mount', () => {
    const { queryAllByTestId } = render(
      <Form data-testid="f" onSubmit={noop}>
        <Select data-testid="i1" name="test">
          <option value="one">One</option>
          <option value="two">Two</option>
        </Select>
      </Form>
    )

    expect(queryAllByTestId('i1').length).toBe(1)
  })

  test('handles blur event', () => {
    const mock = jest.fn(() => true)
    const onBlur = jest.fn()

    const TestComp = (p: { validateOn: 'submit' | 'blur' }) => {
      return (
        <Form data-testid="f" defaults={{ test: 'two' }} onSubmit={noop}>
          <Select
            data-testid="i1"
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

    const { getByTestId, rerender } = render(<TestComp validateOn="submit" />)

    fireEvent.blur(getByTestId('i1'))

    expect(mock).not.toHaveBeenCalled()
    expect(onBlur).toHaveBeenCalled()

    rerender(<TestComp validateOn="blur" />)

    fireEvent.blur(getByTestId('i1'))

    expect(mock).toHaveBeenCalledWith('two')
  })

  test('handles change event', () => {
    const mock = jest.fn(v => true)
    const onChange = jest.fn()

    const { getByTestId } = render(
      <Form data-testid="f" onSubmit={noop} validateOn="change">
        <Select
          data-testid="i1"
          name="test"
          onChange={onChange}
          validate={mock}
        >
          <option value="one">one</option>
        </Select>
      </Form>
    )

    fireEvent.change(getByTestId('i1'), { target: { value: 'one' } })

    expect(mock).toHaveBeenCalledWith('one')
    expect(onChange).toHaveBeenCalled()
  })

  test('handles multi-value change event', () => {
    const mock = jest.fn()
    const onChange = jest.fn()

    const { getByTestId } = render(
      <Form data-testid="f" onSubmit={noop} validateOn="change">
        <Select
          data-testid="i1"
          onChange={onChange}
          name="test"
          multiple
          validate={mock}
        >
          <option value="one">One</option>
          <option value="two">Two</option>
          <option value="three">Three</option>
        </Select>
      </Form>
    )

    const el = getByTestId('i1') as HTMLSelectElement

    el.options[0].selected = true
    el.options[1].selected = false
    el.options[2].selected = true

    fireEvent.change(getByTestId('i1'))

    expect(mock).toHaveBeenCalledWith(['one', 'three'])
    expect(onChange).toHaveBeenCalled()
  })

  test('returns correct value on form submit', () => {
    const onSubmit = jest.fn()
    const { getByTestId } = render(
      <Form data-testid="f" onSubmit={onSubmit}>
        <Select
          data-testid="t"
          name="test"
          transform={(v: string) => v + v.toUpperCase()}
        >
          <option value="one">One</option>
          <option value="two">Two</option>
        </Select>
      </Form>
    )

    fireEvent.change(getByTestId('t'), { target: { value: 'two' } })
    fireEvent.submit(getByTestId('f'))

    expect(onSubmit).toHaveBeenCalledWith({ test: 'twoTWO' })
  })
})
