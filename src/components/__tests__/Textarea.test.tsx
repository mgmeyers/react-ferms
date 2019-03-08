import * as React from 'react'
import { cleanup, fireEvent, render } from 'react-testing-library'

import Form from 'components/Form'
import Status from 'components/Status'
import Textarea from 'components/Textarea'

import { noop } from 'helpers'
import { changeAndSubmit, waitForStatus } from './common'

describe('<Textarea />', () => {
  afterEach(cleanup)

  test('should mount', () => {
    const { queryAllByTestId } = render(
      <Form data-testid="f" onSubmit={noop}>
        <Textarea data-testid="i1" name="test" />
      </Form>
    )

    expect(queryAllByTestId('i1').length).toBe(1)
  })

  test('handles blur event', async () => {
    const mock = jest.fn(() => true)
    const onBlur = jest.fn()

    const TestComp = (p: { validateOn: 'submit' | 'blur' }) => {
      return (
        <Form data-testid="f" defaults={{ test: 'hi' }} onSubmit={noop}>
          <Textarea
            data-testid="i1"
            name="test"
            onBlur={onBlur}
            validate={mock}
            validateOn={p.validateOn}
          />
          <Status
            render={status => <span data-testid={`${status}`}>status</span>}
          />
        </Form>
      )
    }

    const { getByTestId, rerender } = render(<TestComp validateOn="submit" />)

    fireEvent.blur(getByTestId('i1'))

    expect(mock).not.toHaveBeenCalled()
    expect(onBlur).toHaveBeenCalled()

    rerender(<TestComp validateOn="blur" />)

    fireEvent.blur(getByTestId('i1'))

    await waitForStatus(getByTestId)

    expect(mock).toHaveBeenCalledWith('hi')
  })

  test('handles change event', async () => {
    const mock = jest.fn(v => true)
    const onChange = jest.fn()

    const { getByTestId } = render(
      <Form data-testid="f" onSubmit={noop} validateOn="change">
        <Textarea
          data-testid="i1"
          name="test"
          onChange={onChange}
          validate={mock}
        />
        <Status
          render={status => <span data-testid={`${status}`}>status</span>}
        />
      </Form>
    )

    fireEvent.change(getByTestId('i1'), { target: { value: 'hi' } })

    await waitForStatus(getByTestId)

    expect(mock).toHaveBeenCalledWith('hi')
    expect(onChange).toHaveBeenCalled()
  })

  test('returns correct value on form submit', async () => {
    const onSubmit = jest.fn()
    const t = (v: string) => v + v.toUpperCase()
    const { getByTestId } = render(
      <Form data-testid="f" onSubmit={onSubmit}>
        <Textarea data-testid="t" name="test" transform={t} />
        <Status
          render={status => <span data-testid={`${status}`}>status</span>}
        />
      </Form>
    )

    await changeAndSubmit('t', 'hi', getByTestId)

    expect(onSubmit).toHaveBeenCalledWith({ test: 'hiHI' })
  })
})
