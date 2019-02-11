export type TransformFn = (value: any) => any
export type ValidateOnOpts = 'change' | 'blur' | 'submit'
export type ValidationFn = (value: any) => ValidationResults
export type ValidationResults = true | Array<string | Error | JSX.Element>

export interface MapStringAny {
  [key: string]: any
}

export enum FormStatus {
  PRISTINE,
  DIRTY,
  INVALID,
}

export interface FormProps {
  defaults?: object
  validateOn?: ValidateOnOpts

  onSubmit(values: object): void

  preValidate?(): void
  onError?(errors: ValidationResults): void
  validationStrategy?(value: any, validate: ValidationFn): ValidationResults
}
