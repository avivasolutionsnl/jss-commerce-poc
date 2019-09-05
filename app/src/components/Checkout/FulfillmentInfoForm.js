import React from 'react';
import { Redirect } from 'react-router-dom';
import useForm from '../../lib/useForm';
import Errors from './Errors';
import TextField from './TextField';

export default function FulfillmentInfoForm({actions}) {
    const [completed, setCompleted] = React.useState(false);

    const {
        values,
        errors,
        handleChange,
        handleSubmit
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
            async function performSubmit() {
                if (Object.keys(validationErrors).length === 0) {
                    try {
                        await actions.addEmail(values.email);
                        const cart = await actions.setFulfillment(values);
                        await actions.addGiftCardPayment(cart.Totals.GrandTotal.Amount);
                        await actions.createOrder();

                        setCompleted(true);
                    } catch(e) {
                        setErrors({...errors, commerceErrors: e.messages});
                    }
                }
            }

            performSubmit();
        },
        validate(values) {
            const errors = {};

            if (values.email === "") {
                errors.email = "Please enter an email address";
            }

            // TODO: add more validation

            return errors;
        }
    });

    if (completed) {
        return (window.location.pathname !== "/order") ? <Redirect to="/order" /> : null;
    }

    return <form onSubmit={handleSubmit}>
        <Errors errors={errors}/>

        <h4>
            Shipping information
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

        <h4>
            Payment information
            <hr />
        </h4>
        <TextField id="payment" name="Payment method" value="Giftcard" readOnly />

        <button className="fulfillmentinfoform--order" type="submit">Order</button>
    </form>;
}
