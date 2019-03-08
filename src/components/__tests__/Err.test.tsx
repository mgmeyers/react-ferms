import * as React from 'react'
import { cleanup, fireEvent, render } from 'react-testing-library'

import Err, { renderError } from 'components/Err'
import Form from 'components/Form'
import Status from 'components/Status'
import Textarea from 'components/Textarea'

import FormField from 'data/FormField'

import { noop } from 'helpers'
import { defaultFieldOpts, waitForStatus } from './common'

import { FormStatus } from 'types'

describe('<Error />', () => {
  afterEach(cleanup)

  test('renders field values', async () => {
    const mock = jest.fn(() => {
      return ['nope', new Error('what'), <span>not even</span>]
    })
    const s = render(
      <Form onSubmit={noop} validateOn="change">
        <Textarea data-testid="i1" name="test" />
        <Textarea data-testid="i2" name="test2" validate={mock} />
        <div data-testid="e1">
          <Err name="test" />
        </div>
        <div data-testid="e2" className="multi">
          <Err name="test2" />
        </div>
        <Status
          render={status => <span data-testid={`${status}`}>status</span>}
        />
      </Form>
    )

    fireEvent.change(s.getByTestId('i1'), { target: { value: 'hi' } })
    await waitForStatus(s.getByTestId)

    fireEvent.change(s.getByTestId('i2'), { target: { value: 'hey' } })
    await waitForStatus(s.getByTestId, '2')

    expect(mock).toHaveBeenCalled()

    expect(s.getByTestId('e1').textContent).toBe('')

    expect(s.getByTestId('e2').childElementCount).toBe(3)
    expect(s.getByTestId('e2').children.item(0).textContent).toBe('nope')
    expect(s.getByTestId('e2').children.item(1).textContent).toBe('what')
    expect(s.getByTestId('e2').children.item(2).innerHTML).toBe(
      '<span>not even</span>'
    )
  })

  test('calls render function with compiled values', () => {
    const f = new FormField({
      ...defaultFieldOpts,
      errors: ['whoops'],
      status: FormStatus.DIRTY,
      value: 'hi',
    })

    const mock = jest.fn()

    renderError(mock, f)

    expect(mock).toHaveBeenCalledWith(['whoops'])
  })
})
