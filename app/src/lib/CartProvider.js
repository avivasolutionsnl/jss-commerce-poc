import fetch from 'node-fetch';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import CartContext from './CartContext';
import CommerceError from './CommerceError';
import { gatewayUrl } from '../temp/config';

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

async function getCart(token) {
    if (!token) {
        return null;
    }

    let res = await fetch(`${gatewayUrl}/api/carts/me`, {
        headers: {
        'Authorization' : `Bearer ${token}`
        }
    });
    res = handleErrors(res);
    return res.json();
}

async function addCartLine(token, line) {
    let res = await fetch(`${gatewayUrl}/api/carts/me/addline`, {
        method: 'put', 
        headers: {
        'Authorization' : `Bearer ${token}`, 
        'Content-Type' : 'application/json'
        }, 
        body: JSON.stringify(line)
    });
    res = handleErrors(res);
    return res.json();
}

async function removeCartLine(token, lineId) {
    let res = await fetch(`${gatewayUrl}/api/carts/me/lines/${lineId}`, {
        method: 'delete', 
        headers: {
            'Authorization' : `Bearer ${token}`, 
            'Content-Type' : 'application/json'
        }
    });
    res = handleErrors(res);
    return res.json();
}

async function addEmailToCart(token, email) {
    let res = await fetch(`${gatewayUrl}/api/carts/me/addemail`, {
        method: 'put', 
        headers: {
            'Authorization' : `Bearer ${token}`, 
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ email: email })
    });
    res = handleErrors(res);
    return res.json();
}

async function setCartFulfillment(token, fulfillment) {
    let res = await fetch(`${gatewayUrl}/api/carts/me/setfulfillment`, {
        method: 'put', 
        headers: {
            'Authorization' : `Bearer ${token}`, 
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(fulfillment)
    });
    res = handleErrors(res);

    const json = await res.json();
    if (json.ResponseCode === "Error") {
        throw new CommerceError(json.Messages);
    }
    return json;
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

    let res = await fetch(`${gatewayUrl}/api/carts/me/addgiftcardpayment`, {
        method: 'put', 
        headers: {
            'Authorization' : `Bearer ${token}`, 
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(payment)
    });
    res = handleErrors(res);
    
    const json = await res.json();
    if (json.ResponseCode === "Error") {
        throw new CommerceError(json.Messages);
    }
    return json;
}

async function createOrder(token, email) {
    let res = await fetch(`${gatewayUrl}/api/carts/me/createorder`, {
        method: 'put', 
        headers: {
            'Authorization' : `Bearer ${token}`, 
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ email: email })
    });
    res = handleErrors(res);

    const json = await res.json();
    if (json.ResponseCode === "Error") {
        throw new CommerceError(json.Messages);
    }
    return json;
}

async function refreshCart(token, onUpdateCart) {
    const cart = await getCart(token);
    onUpdateCart(cart);
    return cart;
}

export const CartProvider = ({children}) => {
    const token = useContext(AuthContext);
    const [cart, setCart] = useState(null);
    
    const actions = {
        addCartLine: async (line) => {
            await addCartLine(token, line);
            await refreshCart(token, setCart);
        },
        removeCartLine: async (lineId) => {
            await removeCartLine(token, lineId);
            await refreshCart(token, setCart);
        },
        setFulfillment: async (fulfillment) => {
            await setCartFulfillment(token, fulfillment);
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