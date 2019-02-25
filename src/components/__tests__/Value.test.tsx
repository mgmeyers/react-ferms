import * as React from 'react'
import { mount } from 'enzyme'

import Form from 'components/Form'
import Value, { renderValue } from 'components/Value'
import Textarea from 'components/Textarea'

import FormField from 'data/FormField'

import { noop } from 'helpers'
import { defaultFieldOpts } from './common'

import { FormStatus } from 'types'

describe('<Value />', () => {
  test('renders field values', () => {
    const s = mount(
      <Form onSubmit={noop}>
        <Textarea name="test" />
        <Textarea name="test2" validate={() => 'nope'} validateOn="change" />
        <div>
          <Value name="test" />
        </div>
        <div>
          <Value
            name={['test', 'test2']}
            render={(vals, stats) => vals.toString() + stats.toString()}
          />
        </div>
      </Form>
    )

    s.find('textarea')
      .first()
      .simulate('change', { target: { value: 'hi' } })

    s.find('textarea')
      .last()
      .simulate('change', { target: { value: 'hey' } })

    expect(
      s
        .find('div')
        .first()
        .text()
    ).toBe('hi')
    expect(
      s
        .find('div')
        .last()
        .text()
    ).toBe('hi,hey1,2')
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

    renderValue(f, mock)

    expect(mock).toHaveBeenCalledWith('hi', FormStatus.DIRTY)

    renderValue([f, f2], mock)

    expect(mock).toHaveBeenCalledWith(
      ['hi', 'nope'],
      [FormStatus.DIRTY, FormStatus.INVALID]
    )
  })
})
