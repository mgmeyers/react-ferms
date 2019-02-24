import FormField from 'data/FormField'

export interface MapStringAny {
  [key: string]: any
}

export interface MapStringFormField {
  [key: string]: FormField
}

export type TransformFn = (value: any) => any
export type ValidateOnOpts = 'change' | 'blur' | 'submit'
export type ValidationResults = true | Array<string | Error | JSX.Element>
export type ValidationStrategy = (
  value: any,
  validation: any
) => ValidationResults

export enum FormStatus {
  PRISTINE,
  DIRTY,
  INVALID,
}

export interface FormFieldJSON {
  defaultValidateOn: ValidateOnOpts
  key: string
  validationStrategy: ValidationStrategy

  errors?: Array<string | JSX.Element>
  status?: FormStatus
  transform?: TransformFn
  validate?: any
  validateOn?: ValidateOnOpts
  value?: string
}

export interface AddFieldOpts {
  key: string

  transform?: TransformFn
  validate?: any
  validateOn?: ValidateOnOpts
  value?: string
}

export interface FormFieldsOptions {
  defaults?: MapStringAny
  fields?: MapStringFormField
  validateOn?: ValidateOnOpts
  validationStrategy?: ValidationStrategy
}

export interface FormProps {
  defaults?: object
  validateOn?: ValidateOnOpts
  validationStrategy?: ValidationStrategy

  onSubmit(values: object): void

  preValidate?(): void
  onError?(errors: { [key: string]: ValidationResults }): void
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
