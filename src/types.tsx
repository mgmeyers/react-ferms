export type TransformFn = (value: any) => any
export type ValidateOnOpts = 'change' | 'blur' | 'submit'
export type ValidationFn = (value: any) => ValidationResults
export type ValidationResults = boolean | string | Error | JSX.Element

export enum FormStatus {
  PRISTINE,
  DIRTY,
  INVALID,
}

export interface FormProps {
  defaults?: object
  validateOn?: ValidateOnOpts

  onSubmit(values: object): void

  preValidate?(values: object): void
  onError?(errors: object[]): void
  validationStrategy?(value: any, validate: ValidationFn): ValidationResults
}
