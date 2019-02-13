export interface MapStringAny {
  [key: string]: any
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

export interface FormProps {
  defaults?: object
  validateOn?: ValidateOnOpts
  validationStrategy?: ValidationStrategy

  onSubmit(values: object): void

  preValidate?(): void
  onError?(errors: { [key: string]: ValidationResults }): void
}
