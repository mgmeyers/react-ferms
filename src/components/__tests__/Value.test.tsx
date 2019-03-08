import * as React from 'react'
import { cleanup, fireEvent, render } from 'react-testing-library'

import Form from 'components/Form'
import Status from 'components/Status'
import Textarea from 'components/Textarea'
import Value, { renderValue } from 'components/Value'

import FormField from 'data/FormField'

import { noop } from 'helpers'
import { defaultFieldOpts, waitForStatus } from './common'

import { FormStatus } from 'types'

describe('<Value />', () => {
  afterEach(cleanup)

  test('renders field values', async () => {
    const mock = jest.fn(() => {
      return ['nope']
    })

    const s = render(
      <Form onSubmit={noop}>
        <Textarea data-testid="i1" name="test" />
        <Textarea
          data-testid="i2"
          name="test2"
          validate={mock}
          validateOn="change"
        />
        <div data-testid="v1">
          <Value name="test" />
        </div>
        <div data-testid="v2">
          <Value
            name={['test', 'test2']}
            render={(vals, stats) => <>{vals.toString() + stats.toString()}</>}
          />
        </div>
        <Status
          render={status => <span data-testid={`${status}`}>status</span>}
        />
      </Form>
    )

    fireEvent.change(s.getByTestId('i1'), { target: { value: 'hi' } })
    fireEvent.change(s.getByTestId('i2'), { target: { value: 'hey' } })
    await waitForStatus(s.getByTestId, '2')

    expect(mock).toHaveBeenCalled()

    expect(s.getByTestId('v1').textContent).toBe('hi')
    expect(s.getByTestId('v2').textContent).toBe('hi,hey1,2')
  })

  test('calls render function with compiled values', () => {
    const f = new FormField({
      ...defaultFieldOpts,
      status: FormStatus.DIRTY,
      value: 'hi',
    })

    const f2 = new FormField({
      ...defaultFieldOpts,
      status: FormStatus.INVALID,
      value: 'nope',
    })

    const mock = jest.fn()

    renderValue(mock, [f])

    expect(mock).toHaveBeenCalledWith('hi', FormStatus.DIRTY)

    renderValue(mock, [f, f2])

    expect(mock).toHaveBeenCalledWith(
      ['hi', 'nope'],
      [FormStatus.DIRTY, FormStatus.INVALID]
    )
  })
})
