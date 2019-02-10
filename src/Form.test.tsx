import * as React from 'react'
import { shallow } from 'enzyme'

import Form from './Form'

test('should mount', () => {
  const s = shallow(<Form hello="wow" />)

  expect(s.text()).toBe('wow')
})
