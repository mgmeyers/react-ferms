import { mount } from 'enzyme'
import * as React from 'react'

import Error, { renderError } from 'components/Error'
import Form from 'components/Form'
import Textarea from 'components/Textarea'

import FormField from 'data/FormField'

import { noop } from 'helpers'
import { defaultFieldOpts } from './common'

import { FormStatus } from 'types'

describe('<Error />', () => {
  test('renders field values', () => {
    const s = mount(
      <Form onSubmit={noop}>
        <Textarea name="test" />
        <Textarea
          name="test2"
          validate={() => {
            return ['nope', 'not even']
          }}
          validateOn="change"
        />
        <div>
          <Error name="test" />
        </div>
        <div className="multi">
          <Error name="test2" />
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
    ).toBe('')

    const multi = s.find('.multi div')

    expect(multi.length).toBe(2)
    expect(multi.first().text()).toBe('nope')
    expect(multi.last().text()).toBe('not even')
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
