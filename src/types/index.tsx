import FormField from 'data/FormField'
import FormFields from 'data/FormFields'

export interface FormProps {
  /**
   * Default form values in the form of key/value pairs where the key is a form
   * field name, and the value is the form field value. Values in nested objects
   * can be accessed through dot notation.
   *
   * @example
   * <Form
   *   defaults={{ title: 'hello', name: { first: 'John', last: 'Doe'  } }}
   *   onSubmit={values => console.log(values)}
   * >
   *   <Input name="title" type="text" />
   *   <Input name="name.first" type="text" />
   *   <Input name="name.last" type="text" />
   *
   *   <button type="submit">Submit</button>
   * </Form>
   */
  defaults?: MapStringAny

  /**
   * The default setting describing when to trigger field validation. This can
   * be overridden on a per-field basis
   */
  validateOn?: ValidateOnOpts

  /**
   * Applies a field validation to a field value. This can be
   * used to support various third party validation libraries.
   *
   * A validation strategy has the signature:
   * ```
   * (value: any, validation: any) => true | Array<string | Error | JSX.Element>
   * ```
   */
  validationStrategy?: ValidationStrategy

  /**
   * Executed when the form is submitted. onSubmit gets passed an object mapping
   * field names to transformed field values
   */
  onSubmit(values: MapStringAny): void

  /**
   * Executed before a form's onSubmit validation occurs.
   */
  preValidate?(): void

  /**
   * Executed when a form's onSubmit validation fails
   */
  onError?(errors: { [key: string]: ValidationResults }): void
}

export interface FormFieldProps {
  /**
   * The key associated with a form field's value. Supports nested objects through
   * dot notation.
   */
  name: string
  multiple?: boolean

  /**
   * A Function used to transform a fields raw text value.
   * `(value: any) => any`
   */
  transform?: TransformFn
  type?: string

  /**
   * A function used to validate a field's value. The function signature when
   * using the default validation strategy is
   * `(value: any) => true | Array<string | Error | JSX.Element>`
   */
  validate?: any

  /**
   * Override the form's default `validateOn`. Available options are:
   * `submit | blur | change`
   */
  validateOn?: ValidateOnOpts
}

export interface IFormContext {
  add: (field: AddFieldOpts) => void
  fields: FormFields
  remove: (key: string) => void
  setTransform: (key: string, transform: TransformFn) => void
  setValidateOn: (key: string, validateOn: ValidateOnOpts) => void
  setValidation: (key: string, validate: any) => void
  setValue: (key: string, value: string | string[]) => void
  validateField: (key: string) => void
}

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
  multiple?: boolean
  status?: FormStatus
  transform?: TransformFn
  validate?: any
  validateOn?: ValidateOnOpts
  value?: string | string[]
}

export interface FormFieldValidation {
  field: FormField
  valid: boolean
}

export interface FormFieldsValidation {
  fields: FormFields
  valid: boolean
}

export interface AddFieldOpts {
  key: string

  multiple?: boolean
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

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
