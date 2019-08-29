import React, { useContext } from 'react';
import { withNamespaces } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import useForm from '../../lib/useForm';
import CartContext from '../../lib/CartContext';

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

const TextField = ({id, name, value, onChange, readOnly}) => 
    <div className="textfield">
        <label htmlFor={id}>{name}</label>
        <input
            type="text"
            name={id}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
        />
    </div>

const Errors = ({errors}) => {
    if (!errors || Object.keys(errors).length === 0) {
        return null;
    }

    const errorLines = Object.keys(errors).map(key => errors[key]).flat();

    return <ul className="errors">
        {errorLines.map((e, i) => <li key={i}>{e}</li>)}
    </ul>
}

const FulfillmentInfoForm = ({actions}) => {
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
                        const cart = await actions.setFulfillment(mapToFulfillment(values));
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

const Checkout = ({t}) => {
    const cart = useContext(CartContext);

    return (
        <article className="checkout">
            <header>
                <h1 className="checkout__title">{t('checkout-title')}</h1>
            </header>
            <section className="checkout__fulfillment_info">
                <FulfillmentInfoForm actions={cart.actions} />
            </section>
            <footer>
            </footer>
        </article>
    );
}

export default withNamespaces()(Checkout);
