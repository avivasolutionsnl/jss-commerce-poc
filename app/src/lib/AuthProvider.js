import fetch from 'node-fetch';
import React, { useEffect, useState } from 'react';
import AuthContext from './AuthContext';

function getToken() {
    return fetch('https://localhost:5001/identity/authentication/getanonymoustoken', {
        method: 'post'
    })
    .then(res => {
        if (!res.ok) {
            throw Error(res.statusText);
        }
        return res.json();
    })
    .then(json => json.token);
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
