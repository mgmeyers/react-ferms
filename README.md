# react-ferms

Default strategies: 
* v8n
* yup
* validation.js

status
* valid
* pristine


```
<Form 
    defaults={{ ... }}
    onSubmit={formVals => {}} 
    onError={(errors, forceSubmit) => {
        if (isOk(errors)) {
            forceSubmit()
        }
    }} 
    preValidate={formVals => {}}
    validationStrategy={someFunction}
    validateOn="change|blur|submit"
>
    <div> 
        <Value name="user.email" render={(value, status) => {
            return `${MAX_LENGTH - value.length} characters remaining`
        }} />

        <Value name={["days", "price"]} render={([days, price], [daysStatus, priceStatus]) => {
            return `Total: $${days * price}`
        }} />

        <Input 
            default="hello@email.com"
            name="user.email" 
            transform={value => value.toLowerCase()}
            validate={async email => {
                const exists = await exists(email)
                return exists ? 
                    (<p>This email is taken. <a href="#login">Click here to sign in</a></p>) :
                    true
            }} 
            validateOn="change|blur|submit"
        />

        <Error 
            name="user.email"
            render={(outputFromValidate, status) => {
                return doSomething(outputFromValidate)
            }}
        />
    </div> 
</Form>
```
