import * as React from 'react'
import { cleanup, fireEvent, render } from 'react-testing-library'

import Form from 'components/Form'
import Input from 'components/Input'

import { noop } from 'helpers'

import { TransformFn, ValidateOnOpts } from 'types'

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

  test('should respond to prop updates', () => {
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

    fireEvent.change(getByTestId('i1'), { target: { value: 'hi' } })
    fireEvent.submit(getByTestId('f'))

    expect(transMock).toHaveBeenCalledWith('hi')
    expect(validateMock).toHaveBeenCalledWith('hihi')
  })

  test('should respond to key updates', () => {
    const mock = jest.fn()

    const TestComp = (p: { name: string }) => {
      return (
        <Form data-testid="f" onSubmit={mock}>
          <Input data-testid="i1" {...p} />
        </Form>
      )
    }

    const { getByTestId, rerender } = render(<TestComp name="test" />)

    fireEvent.change(getByTestId('i1'), { target: { value: 'hi' } })
    fireEvent.submit(getByTestId('f'))

    expect(mock).toHaveBeenCalledWith({ test: 'hi' })

    rerender(<TestComp name="hey" />)

    fireEvent.submit(getByTestId('f'))

    expect(mock).toHaveBeenCalledWith({ hey: 'hi' })

    fireEvent.change(getByTestId('i1'), { target: { value: 'hello' } })
    fireEvent.submit(getByTestId('f'))

    expect(mock).toHaveBeenCalledWith({ hey: 'hello' })
  })

  test('removes field on unmount', () => {
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
        </Form>
      )
    }

    const { getByTestId, rerender } = render(<TestComp which={0} />)

    fireEvent.change(getByTestId('i1'), { target: { value: 'hi' } })
    fireEvent.submit(getByTestId('f'))

    expect(mock).toHaveBeenCalledWith({ test: 'hi' })

    rerender(<TestComp which={1} />)

    fireEvent.change(getByTestId('i2'), { target: { value: 'hey' } })
    fireEvent.submit(getByTestId('f'))

    expect(mock).toHaveBeenCalledWith({ test2: 'hey' })
  })

  test('validates field', () => {
    const mock = jest.fn(() => true)

    const { getByTestId } = render(
      <Form data-testid="f" onSubmit={noop}>
        <Input
          data-testid="i1"
          name="test"
          validate={mock}
          validateOn="change"
        />
      </Form>
    )

    fireEvent.change(getByTestId('i1'), { target: { value: 'hi' } })

    expect(mock).toHaveBeenCalledWith('hi')
  })

  test('gets field value', () => {
    const { getByTestId } = render(
      <Form data-testid="f" onSubmit={noop}>
        <Input data-testid="i1" name="test" />
      </Form>
    )

    fireEvent.change(getByTestId('i1'), { target: { value: 'hi' } })

    expect((getByTestId('i1') as HTMLInputElement).value).toBe('hi')
  })

  test('handles blur event', () => {
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
        </Form>
      )
    }

    const { getByTestId, rerender } = render(<TestComp validateOn="submit" />)

    fireEvent.blur(getByTestId('i1'))

    expect(mock).not.toHaveBeenCalled()
    expect(onBlur).toHaveBeenCalled()

    rerender(<TestComp validateOn="blur" />)

    fireEvent.blur(getByTestId('i1'))

    expect(mock).toHaveBeenCalledWith('hi')
  })

  test('handles change event', () => {
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
      </Form>
    )

    fireEvent.change(getByTestId('i1'), { target: { value: 'hi' } })

    expect(mock).toHaveBeenCalledWith('hi')
    expect(onChange).toHaveBeenCalled()
  })

  test('handles checkbox inputs', () => {
    const onSubmit = jest.fn()

    const { getByTestId } = render(
      <Form data-testid="f" onSubmit={onSubmit}>
        <Input data-testid="i1" name="test" type="checkbox" value="one" />
        <Input data-testid="i2" name="test" type="checkbox" value="two" />
      </Form>
    )

    fireEvent.click(getByTestId('i1'))
    fireEvent.submit(getByTestId('f'))

    expect(onSubmit).toHaveBeenCalledWith({
      test: ['one'],
    })

    onSubmit.mockReset()

    fireEvent.click(getByTestId('i2'))
    fireEvent.submit(getByTestId('f'))

    expect(onSubmit).toHaveBeenCalledWith({
      test: ['one', 'two'],
    })

    onSubmit.mockReset()

    fireEvent.click(getByTestId('i1'))
    fireEvent.submit(getByTestId('f'))

    expect(onSubmit).toHaveBeenCalledWith({
      test: ['two'],
    })

    onSubmit.mockReset()

    fireEvent.click(getByTestId('i2'))
    fireEvent.submit(getByTestId('f'))

    expect(onSubmit).toHaveBeenCalledWith({
      test: [],
    })
  })

  test('returns correct value on form submit', () => {
    const onSubmit = jest.fn()
    const t = (v: string) => v + v.toUpperCase()
    const { getByTestId } = render(
      <Form data-testid="f" onSubmit={onSubmit}>
        <Input data-testid="t" name="test" transform={t} />
        <button data-testid="s" type="submit">
          Submit
        </button>
      </Form>
    )

    const input = getByTestId('t') as HTMLInputElement

    fireEvent.change(input, { target: { value: 'hi' } })

    expect(input.value).toBe('hi')

    fireEvent.click(getByTestId('s'))

    expect(onSubmit).toHaveBeenCalledWith({ test: 'hiHI' })
  })
})
