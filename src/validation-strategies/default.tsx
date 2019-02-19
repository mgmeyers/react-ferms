import { ValidationResults } from 'types'

export default (value: any, validation: any): ValidationResults => {
  const fn = validation as (v: any) => ValidationResults
  return fn(value)
}
