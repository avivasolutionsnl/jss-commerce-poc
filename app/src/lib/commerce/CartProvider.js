
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import CartContext from './CartContext';
import commerceRequest from './request';
import { trackCartlineAdded, trackCartlineRemoved } from './tracking';

async function getCart(token) {
    if (!token) {
        return null;
    }

    return commerceRequest.get('api/carts/me', token);
}

async function addCartLine(token, line) {
    await commerceRequest.put('api/carts/me/addline', token, JSON.stringify(line));
    trackCartlineAdded(line);
}

async function removeCartLine(token, line) {
    await commerceRequest.del(`api/carts/me/lines/${line.id}`, token);
    trackCartlineRemoved(line);
}

async function addEmailToCart(token, email) {
    return commerceRequest.put('api/carts/me/addemail', token, JSON.stringify({ email: email }));
}

async function setCartFulfillment(token, {firstname, lastname, city, address, state, country, zippostalcode}) {
    const fulfillment = {
        fulfillment : {
            "@odata.type": "Sitecore.Commerce.Plugin.Fulfillment.PhysicalFulfillmentComponent",
            shippingParty : {
                AddressName: "default",
                FirstName: firstname,
                LastName: lastname,
                City: city,
                Address1: address,
                State: state,
                Country: country,
                ZipPostalCode: zippostalcode
            },
            fulfillmentMethod: {
                entityTarget: "b146622d-dc86-48a3-b72a-05ee8ffd187a", 
                name: "Ground"
            }
        }
    };

    return commerceRequest.put('api/carts/me/setfulfillment', token, JSON.stringify(fulfillment));
}

async function addGiftCardPayment(token, amount) {
    const payment = {
        payment : {
            "@odata.type": "Sitecore.Commerce.Plugin.GiftCards.GiftCardPaymentComponent",
            PaymentMethod: {
                EntityTarget: "B5E5464E-C851-4C3C-8086-A4A874DD2DB0", 
                Name: "GiftCard"
            },
            GiftCardCode: "GC1000000",
            Amount: { Amount: amount }
        }
    }

    return await commerceRequest.put('api/carts/me/addgiftcardpayment', token, JSON.stringify(payment));
}

async function createOrder(token, email) {
    return await commerceRequest.put('api/carts/me/createorder', token, JSON.stringify({ email: email }));
}

async function refreshCart(token, onUpdateCart) {
    const cart = await getCart(token);
    onUpdateCart(cart);
    return cart;
}

export default function CartProvider({children}) {
    const token = useContext(AuthContext);
    const [cart, setCart] = useState(null);
    
    const actions = {
        addCartLine: async (line) => {
            await addCartLine(token, line);
            await refreshCart(token, setCart);
        },
        removeCartLine: async (line) => {
            await removeCartLine(token, line);
            await refreshCart(token, setCart);
        },
        setFulfillment: async (values) => {
            await setCartFulfillment(token, values);
            const cart = await refreshCart(token, setCart);
            return cart;
        },
        addEmail: async (email) => {
            await addEmailToCart(token, email);
        },
        addGiftCardPayment: async (amount) => {
            await addGiftCardPayment(token, amount);
        },
        createOrder: async _ => {
            await createOrder(token, cart.email);
            await refreshCart(token, setCart); // Cart is empty => refresh
        }
    };

    useEffect(() => {
        refreshCart(token, setCart);
    }, [token]);

    const cartContext = {
        data: cart,
        actions: actions
    };

    return (
        <CartContext.Provider value={cartContext}>
            {children}
        </CartContext.Provider>
    );
}