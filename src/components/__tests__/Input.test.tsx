import * as React from 'react'
import { cleanup, fireEvent, render } from 'react-testing-library'

import Form from 'components/Form'
import Input from 'components/Input'
import Status from 'components/Status'

import { noop } from 'helpers'

import { TransformFn, ValidateOnOpts } from 'types'
import { changeAndSubmit, waitForStatus } from './common'

describe('<Input />', () => {
  afterEach(cleanup)

  test('should mount', () => {
    const { queryAllByTestId } = render(
      <Form data-testid="f" onSubmit={noop}>
        <Input data-testid="i1" name="test" />
      </Form>
    )

    expect(queryAllByTestId('i1').length).toBe(1)
  })

  test('should respond to prop updates', async () => {
    const transMock = jest.fn((v: string) => v + v)
    const validateMock = jest.fn(() => true)

    const TestComp = (p: {
      transform?: TransformFn
      validate?: any
      validateOn?: ValidateOnOpts
    }) => {
      return (
        <Form data-testid="f" defaults={{ test: 'hi' }} onSubmit={noop}>
          <Input data-testid="i1" name="test" {...p} />
          <Status
            render={status => <span data-testid={`${status}`}>status</span>}
          />
        </Form>
      )
    }

    const { getByTestId, rerender } = render(<TestComp />)

    rerender(
      <TestComp
        transform={transMock}
        validate={validateMock}
        validateOn="change"
      />
    )

    await changeAndSubmit('i1', 'hi', getByTestId)

    expect(transMock).toHaveBeenCalledWith('hi')
    expect(validateMock).toHaveBeenCalledWith('hihi')
  })

  test('should respond to key updates', async () => {
    const mock = jest.fn()

    const TestComp = (p: { name: string }) => {
      return (
        <Form data-testid="f" onSubmit={mock}>
          <Input data-testid="i1" {...p} />
          <Status
            render={status => <span data-testid={`${status}`}>status</span>}
          />
        </Form>
      )
    }

    const { getByTestId, rerender } = render(<TestComp name="test" />)

    await changeAndSubmit('i1', 'hi', getByTestId)

    expect(mock).toHaveBeenCalledWith({ test: 'hi' })

    rerender(<TestComp name="hey" />)

    fireEvent.submit(getByTestId('f'))

    await waitForStatus(getByTestId)

    expect(mock).toHaveBeenCalledWith({ hey: 'hi' })

    await changeAndSubmit('i1', 'hello', getByTestId)

    expect(mock).toHaveBeenCalledWith({ hey: 'hello' })
  })

  test('removes field on unmount', async () => {
    const mock = jest.fn()

    const TestComp = (p: { which: 0 | 1 }) => {
      return (
        <Form data-testid="f" onSubmit={mock}>
          {p.which === 0 ? (
            <Input data-testid="i1" name="test" />
          ) : (
            <div>
              <Input data-testid="i2" name="test2" />
            </div>
          )}
          <Status
            render={status => <span data-testid={`${status}`}>status</span>}
          />
        </Form>
      )
    }

    const { getByTestId, rerender } = render(<TestComp which={0} />)

    await changeAndSubmit('i1', 'hi', getByTestId)

    expect(mock).toHaveBeenCalledWith({ test: 'hi' })

    rerender(<TestComp which={1} />)

    await changeAndSubmit('i2', 'hey', getByTestId)

    expect(mock).toHaveBeenCalledWith({ test2: 'hey' })
  })

  test('validates field', async () => {
    const mock = jest.fn(() => true)

    const { getByTestId } = render(
      <Form data-testid="f" onSubmit={noop}>
        <Input
          data-testid="i1"
          name="test"
          validate={mock}
          validateOn="change"
        />
        <Status
          render={status => <span data-testid={`${status}`}>status</span>}
        />
      </Form>
    )

    fireEvent.change(getByTestId('i1'), { target: { value: 'hi' } })

    await waitForStatus(getByTestId)

    expect(mock).toHaveBeenCalledWith('hi')
  })

  test('gets field value', () => {
    const { getByTestId } = render(
      <Form data-testid="f" onSubmit={noop}>
        <Input data-testid="i1" name="test" />
        <Status
          render={status => <span data-testid={`${status}`}>status</span>}
        />
      </Form>
    )

    fireEvent.change(getByTestId('i1'), { target: { value: 'hi' } })

    expect((getByTestId('i1') as HTMLInputElement).value).toBe('hi')
  })

  test('handles blur event', async () => {
    const mock = jest.fn(() => true)
    const onBlur = jest.fn()

    const TestComp = (p: { validateOn: 'submit' | 'blur' }) => {
      return (
        <Form data-testid="f" defaults={{ test: 'hi' }} onSubmit={noop}>
          <Input
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
        <Input
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

  test('handles checkbox inputs', async () => {
    const onSubmit = jest.fn()

    const { getByTestId } = render(
      <Form data-testid="f" onSubmit={onSubmit}>
        <Input data-testid="i1" name="test" type="checkbox" value="one" />
        <Input data-testid="i2" name="test" type="checkbox" value="two" />
        <Status
          render={status => <span data-testid={`${status}`}>status</span>}
        />
      </Form>
    )

    fireEvent.click(getByTestId('i1'))
    fireEvent.submit(getByTestId('f'))

    await waitForStatus(getByTestId)

    expect(onSubmit).toHaveBeenCalledWith({
      test: ['one'],
    })

    onSubmit.mockReset()

    fireEvent.click(getByTestId('i2'))
    fireEvent.submit(getByTestId('f'))

    await waitForStatus(getByTestId)

    expect(onSubmit).toHaveBeenCalledWith({
      test: ['one', 'two'],
    })

    onSubmit.mockReset()

    fireEvent.click(getByTestId('i1'))
    fireEvent.submit(getByTestId('f'))

    await waitForStatus(getByTestId)

    expect(onSubmit).toHaveBeenCalledWith({
      test: ['two'],
    })

    onSubmit.mockReset()

    fireEvent.click(getByTestId('i2'))
    fireEvent.submit(getByTestId('f'))

    await waitForStatus(getByTestId)

    expect(onSubmit).toHaveBeenCalledWith({
      test: [],
    })
  })

  test('returns correct value on form submit', async () => {
    const onSubmit = jest.fn()
    const t = (v: string) => v + v.toUpperCase()
    const { getByTestId } = render(
      <Form data-testid="f" onSubmit={onSubmit}>
        <Input data-testid="t" name="test" transform={t} />
        <button data-testid="s" type="submit">
          Submit
        </button>
        <Status
          render={status => <span data-testid={`${status}`}>status</span>}
        />
      </Form>
    )

    const input = getByTestId('t') as HTMLInputElement

    fireEvent.change(input, { target: { value: 'hi' } })

    expect(input.value).toBe('hi')

    fireEvent.click(getByTestId('s'))

    await waitForStatus(getByTestId)

    expect(onSubmit).toHaveBeenCalledWith({ test: 'hiHI' })
  })
})
