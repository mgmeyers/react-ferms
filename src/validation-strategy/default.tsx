import { ValidationFn, ValidationResults } from 'types'

export default (value: any, validation: any): ValidationResults => {
  const fn = validation as ValidationFn
  return fn(value)
}
