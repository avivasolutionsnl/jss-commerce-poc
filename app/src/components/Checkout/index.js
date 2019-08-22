import React, { useState, useContext } from 'react';
import { withNamespaces } from 'react-i18next';
import { gatewayUrl } from '../../temp/config';
import useForm from '../../lib/useForm';
import AuthContext from '../../lib/AuthContext';

export function addEmailToCart(token, email) {
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
    .then(res => res.json())
    .then(console.log);
}

const FulfillmentInfoForm = ({t, onCheckout}) => {
    const {
        values,
        errors,
        handleChange,
        handleSubmit,
    } = useForm({
        initialValues: {
            email: ""
        },
        onSubmit(values, errors) {
            if (Object.keys(errors).length === 0) {
                onCheckout(values);
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

        <div>
            <label htmlFor="email">Email</label>
            <input
                type="text"
                name="email"
                value={values.email}
                onChange={handleChange}
            />
        </div>

        <div>
            <button type="submit">Checkout</button>
        </div>

        <ul>
            {errors && Object.keys(errors).map(key => <li>{errors[key]}</li>)}
        </ul>
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
                <FulfillmentInfoForm t={t} onCheckout={({email}) => addEmailToCart(token, email)} />
            </section>
            <footer>
            </footer>
        </article>
    );
}

export default withNamespaces()(Checkout);