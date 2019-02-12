import * as React from 'react'
import { shallow } from 'enzyme'

import Form from './Form'

const noop = (): void => void 0

test('should mount', () => {
  const s = shallow(<Form onSubmit={noop} />)

  expect(s.length).toBe(1)
})
