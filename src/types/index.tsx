export interface MapStringAny {
  [key: string]: any
}

export type TransformFn = (value: any) => any
export type ValidateOnOpts = 'change' | 'blur' | 'submit'
export type ValidationFn = (value: any) => ValidationResults
export type ValidationResults = true | Array<string | Error | JSX.Element>

export enum FormStatus {
  PRISTINE,
  DIRTY,
  INVALID,
}

export interface FormFieldJSON {
  key: string

  errors?: Array<string | JSX.Element>
  status?: FormStatus
  transform?: TransformFn
  validate?: ValidationFn
  validateOn?: ValidateOnOpts
  value?: string
}

export interface FormProps {
  defaults?: object
  validateOn?: ValidateOnOpts

  onSubmit(values: object): void

  preValidate?(): void
  onError?(errors: { [key: string]: ValidationResults }): void
  validationStrategy?(value: any, validate: ValidationFn): ValidationResults
}
