import fetch from 'node-fetch';
import ls from 'local-storage';
import React, { useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import { gatewayUrl } from '../temp/config';

function getToken() {
    const localStorageTokenKey = 'commerce-token';

    const token = ls.get(localStorageTokenKey);
    if (token) {
        return Promise.resolve(token);
    }

    return fetch(`${gatewayUrl}/identity/authentication/getanonymoustoken`, {
        method: 'post'
    })
    .then(res => {
        if (!res.ok) {
            throw Error(res.statusText);
        }
        return res.json();
    })
    .then(json => {
        ls.set(localStorageTokenKey, json.token);
        return json.token;
    });
}

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        getToken().then(t => setToken(t));
    }, []);

    return (
        <AuthContext.Provider value={token}>
            {children}
        </AuthContext.Provider>
    );
}
