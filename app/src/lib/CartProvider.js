import fetch from 'node-fetch';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import CartContext from './CartContext';
import { gatewayUrl } from '../temp/config';

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

function getCart(token) {
    return fetch(`${gatewayUrl}/api/carts/me`, {
        headers: {
        'Authorization' : `Bearer ${token}`
        }
    })
    .then(handleErrors)
    .then(res => res.json());
}

export function addCartLine(token, line) {
    return fetch(`${gatewayUrl}/api/carts/me/addline`, {
        method: 'put', 
        headers: {
        'Authorization' : `Bearer ${token}`, 
        'Content-Type' : 'application/json'
        }, 
        body: JSON.stringify(line)
    })
    .then(handleErrors)
    .then(res => res.json());
}

function removeCartLine(token, lineId) {
    return fetch(`${gatewayUrl}/api/carts/me/lines/${lineId}`, {
        method: 'delete', 
        headers: {
            'Authorization' : `Bearer ${token}`, 
            'Content-Type' : 'application/json'
        }
    })
    .then(handleErrors)
    .then(res => res.json());
}

function refreshCart(token, onUpdateCart) {
    if (token != null) {
        getCart(token).then(c => onUpdateCart(c));
    }
}

export const CartProvider = ({children}) => {
    const token = useContext(AuthContext);
    const [cart, setCart] = useState(null);
    
    const actions = {
        addCartLine: (line) => addCartLine(token, line).then(() => refreshCart(token, setCart)), // Always refresh cart
        removeCartLine: (lineId) => removeCartLine(token, lineId).then(() => refreshCart(token, setCart))
    };

    useEffect(() => refreshCart(token, setCart), [token]);

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