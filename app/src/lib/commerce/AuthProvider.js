import fetch from 'node-fetch';
import ls from 'local-storage';
import React, { useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import { gatewayUrl } from '../../temp/config';

async function getToken() {
    const localStorageTokenKey = 'commerce-token';

    const token = ls.get(localStorageTokenKey);
    if (token) {
        return Promise.resolve(token);
    }

    const res = await fetch(`${gatewayUrl}/identity/authentication/getanonymoustoken`, {
        method: 'post'
    });

    if (!res.ok) {
        throw Error(res.statusText);
    }

    const json = await res.json();
    ls.set(localStorageTokenKey, json.token);

    return json.token;
}

export default function AuthProvider({children}) {
    const [token, setToken] = useState(null);

    useEffect(() => {
        async function retrieveToken() {
            const token = await getToken();
            setToken(token);
        }

        retrieveToken();
    }, []);

    return (
        <AuthContext.Provider value={token}>
            {children}
        </AuthContext.Provider>
    );
}
