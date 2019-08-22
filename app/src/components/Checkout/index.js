import React, { useContext } from 'react';
import { withNamespaces } from 'react-i18next';
import { gatewayUrl } from '../../temp/config';
import useForm from '../../lib/useForm';
import AuthContext from '../../lib/AuthContext';

function addEmailToCart(token, email) {
    return fetch(`${gatewayUrl}/api/carts/me/addemail`, {
        method: 'put', 
        headers: {
            'Authorization' : `Bearer ${token}`, 
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    })
    .then(res => res.json());
}

function mapToFulfillment(values) {
    return {
        fulfillment : {
            "@odata.type": "Sitecore.Commerce.Plugin.Fulfillment.PhysicalFulfillmentComponent",
            shippingParty : {
                AddressName: "default",
                FirstName: values.firstname,
                LastName: values.lastname,
                City: values.city,
                Address1: values.address,
                State: values.state,
                Country: values.country,
                ZipPostalCode: values.zippostalcode
            },
            fulfillmentMethod: {
                entityTarget: "b146622d-dc86-48a3-b72a-05ee8ffd187a", 
                name: "Ground"
            }
        }
    }
}

function mapMessagesToLines(messages) {
    return messages.map(val => val.Text);
}

class CommerceError extends Error {
    constructor(messages = [], ...params) {
        super(...params);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CommerceError);
        }
  
        this.name = 'CommerceError';
        this.messages = messages;
    }
}

function setCartFulfillment(token, fulfillment) {
    return fetch(`${gatewayUrl}/api/carts/me/setfulfillment`, {
        method: 'put', 
        headers: {
            'Authorization' : `Bearer ${token}`, 
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(fulfillment)
    })
    .then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    })
    .then(res => res.json())
    .then(json => {
        if (json.ResponseCode === "Error") {
            throw new CommerceError(mapMessagesToLines(json.Messages));
        }
        return json;
    });
}

function performCheckout(token, values) {
    return addEmailToCart(token, values.email)
        .then(_ => setCartFulfillment(token, mapToFulfillment(values)));
}

const TextField = ({id, name, value, onChange}) => 
    <div>
        <label htmlFor={id}>{name}</label>
        <input
            type="text"
            name={id}
            value={value}
            onChange={onChange}
        />
    </div>

const Errors = ({errors}) => {
    if (!errors) {
        return null;
    }

    const errorLines = Object.keys(errors).map(key => errors[key]).flat();

    return <ul>
        {errorLines.map(e => <li>{e}</li>)}
    </ul>
}

const FulfillmentInfoForm = ({t, onCheckout}) => {
    const {
        values,
        errors,
        handleChange,
        handleSubmit,
    } = useForm({
        initialValues: {
            email: "",
            firstname: "",
            lastname: "",
            city: "",
            address: "",
            state: "",
            country: "",
            zippostalcode: ""
        },
        onSubmit(values, validationErrors, setErrors) {
            if (Object.keys(validationErrors).length === 0) {
                onCheckout(values)
                .catch(e => setErrors({...errors, commerceErrors: e.messages}));
            }
        },
        validate(values) {
            const errors = {};

            if (values.email === "") {
                errors.email = "Please enter an email address";
            }

            return errors;
        }
    });

    return <form onSubmit={handleSubmit} >
        <h4>
            Fulfillment information
          <hr />
        </h4>

        <TextField id="email" name="Email" value={values.email} onChange={handleChange} />
        <TextField id="firstname" name="First name" value={values.firstname} onChange={handleChange} />
        <TextField id="lastname" name="Last name" value={values.lastname} onChange={handleChange} />
        <TextField id="city" name="City" value={values.city} onChange={handleChange} />
        <TextField id="address" name="Address" value={values.address} onChange={handleChange} />
        <TextField id="state" name="State" value={values.state} onChange={handleChange} />
        <TextField id="country" name="Country" value={values.country} onChange={handleChange} />
        <TextField id="zippostalcode" name="Zip" value={values.zippostalcode} onChange={handleChange} />

        <div>
            <button type="submit">Checkout</button>
        </div>

        <Errors errors={errors}/>
    </form>;
}

const Checkout = ({t}) => {
    const token = useContext(AuthContext);

    return (
        <article className="checkout">
            <header>
                <h1 className="checkout__title">{t('checkout-title')}</h1>
            </header>
            <section className="checkout__fulfillment_info">
                <FulfillmentInfoForm t={t} onCheckout={values => performCheckout(token, values)} />
            </section>
            <footer>
            </footer>
        </article>
    );
}

export default withNamespaces()(Checkout);
