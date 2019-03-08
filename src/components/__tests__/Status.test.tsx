import { mount } from 'enzyme'
import * as React from 'react'
import {
  cleanup,
  fireEvent,
  render,
  waitForElement,
} from 'react-testing-library'

import Form from 'components/Form'
import Status from 'components/Status'
import Textarea from 'components/Textarea'

import FormField from 'data/FormField'

import { noop } from 'helpers'
import { defaultFieldOpts } from './common'

import { FormStatus } from 'types'

describe('<Status />', () => {
  afterEach(cleanup)

  test('renders field status', async () => {
    const s = render(
      <Form onSubmit={noop}>
        <Textarea data-testid="i1" name="test" />
        <Status
          name="test"
          render={v => <span data-testid="wrapper">{v}</span>}
        />
      </Form>
    )

    waitForElement(() => s.getByTestId('wrapper'))

    expect(s.getByTestId('wrapper').textContent).toBe(`${FormStatus.PRISTINE}`)

    fireEvent.change(s.getByTestId('i1'), { target: { value: 'hey' } })

    expect(s.getByTestId('wrapper').textContent).toBe(`${FormStatus.DIRTY}`)
  })

  test('renders global status', async () => {
    const s = render(
      <Form onSubmit={noop}>
        <Textarea data-testid="i1" name="test" />
        <Textarea data-testid="i2" name="test2" />
        <Status render={v => <span data-testid="wrapper">{v}</span>} />
      </Form>
    )

    waitForElement(() => s.getByTestId('wrapper'))

    expect(s.getByTestId('wrapper').textContent).toBe(`${FormStatus.PRISTINE}`)

    fireEvent.change(s.getByTestId('i1'), { target: { value: 'hey' } })

    expect(s.getByTestId('wrapper').textContent).toBe(`${FormStatus.DIRTY}`)
  })
})
