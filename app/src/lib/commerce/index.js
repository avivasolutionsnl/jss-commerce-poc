import React from 'react';
import AuthProvider from './AuthProvider';
import CartProvider from './CartProvider';
import CartContext from './CartContext';

const CommerceProvider = ({children}) => {
    return (
        <AuthProvider>
            <CartProvider>{children}</CartProvider>
        </AuthProvider>
    );
}

export {
    CartContext,
    CommerceProvider
}