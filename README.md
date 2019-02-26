# react-ferms

## `<Form />`

The base form component and context provider for all enclosed form fields.

```jsx
<Form
    defaults={{ 
        title: 'hello', 
        name: { first: 'John', last: 'Doe'  } 
    }}
    onSubmit={values => console.log(values)}
>
    <div>
        <h2>Inputs</h2>

        <Input 
            name="title" 
            transform={v => v.toUpperCase()}
            type="text" 
        />

        <Input 
            name="name.first" 
            type="text" 
            validate={v => {
                if (v === 'bob') {
                    const err = (
                        <span className="error">
                            No Bobs allowed!
                        </span>
                    )

                    return [err]
                }

                return true
            }}
        />

        <Input name="name.last" type="text" />
    </div>

    <div>
        <h2>Values</h2>
        <ul>
            <li><Value name="title" /></li>
            <li>
                <Value 
                    name={['name.first', 'name.last']}
                    render={([firstName, lastName]) => {
                        return (
                            <span>
                                <strong>Name:</strong>
                                {firstName} {lastName}
                            </span>
                        )
                    }} 
                />
            </li>
        </ul>
    </div>

    <div>
        <h2>Errors</h2>
        <Error name="name.first" />
    </div>

    <button type="submit">Submit</button>
</Form>
```

### Props

#### `defaults?: { [key: string]: any }`

Default form values in the form of key/value pairs where the key is a form field name, and the value is the form field value. Values in nested objects can be accessed through dot notation.

#### `validateOn?: 'change' | 'blur' | 'submit'`

The default setting describing when to trigger field validation. This can be overridden on a per-field basis

#### `validationStrategy?: (value: any, validation: any) => true | Array<string | Error | JSX.Element>`

Applies a field validation to a field value. This can be used to support various third party validation libraries.

#### `onSubmit(values: { [key: string]: any }): void`

Executed when the form is submitted. `onSubmit` gets passed an object mapping field names to transformed field values. Nested values are supported through dot notation.

#### `preValidate?(): void`

Executed before a form's onSubmit validation occurs.

#### `onError?(errors: { [key: string]: Array<string | Error | JSX.Element> }): void`

Executed when a form's onSubmit validation fails


## Form Fields

### Supported Input Fields

* `<Input />`
* `<Select />`
* `<Textarea />`

### Props

Each field supports all the props of the field it is shadowing, plus:

#### `name: string`

The key associated with a form field's value. Supports nested objects through dot notation.

#### `transform?: (value: any) => any`

Used to transform a fields before validation occurs. The transformed value is returned by `onSubmit`

#### `validate?: any`

A function used to validate a field's value. The function signature when using the default validation strategy is `(value: any) => true | Array<string | Error | JSX.Element>`

#### `validateOn?: 'submit' | 'blur' | 'change'`

Override the form's default `validateOn`

---

## `<Value />`

Outputs the transformed value of a form field.

### Props

#### `name: string | string[]`

The field name or names to render

#### `render?: (value: any | any[], status: FormStatus | FormStatus[]) => React.ReactNode`

```typescript
enum FormStatus {
  PRISTINE,
  DIRTY,
  INVALID,
}
```

---

## `<Err />`

Outputs any errors associated with a field.

### Props
#### `name: string`

The desired field's name

#### `render?: (errors: Array<string | Error | JSX.Element>) => React.ReactNode`

---

## TODO:

* Add rollup build
* ComponentShouldUpdate
* Async validation
* Additional strategies
