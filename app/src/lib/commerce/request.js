import fetch from 'node-fetch';
import CommerceError from './CommerceError';
import { gatewayUrl } from '../../temp/config';

async function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }

    const json = await response.json();
    if (json.ResponseCode === "Error") {
        throw new CommerceError(json.Messages);
    }

    return json;
}

export async function get(uri, token) {
    let res = await fetch(`${gatewayUrl}/${uri}`, {
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    });

    return handleErrors(res);
}

export async function del(uri, token) {
    let res = await fetch(`${gatewayUrl}/${uri}`, {
        method: 'delete', 
        headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type' : 'application/json'
        }
    });

    return handleErrors(res);
}

export async function put(uri, token, body) {
    let res = await fetch(`${gatewayUrl}/${uri}`, {
        method: 'put', 
        headers: {
            'Authorization' : `Bearer ${token}`, 
            'Content-Type' : 'application/json'
        }, 
        body: body
    });

    return handleErrors(res);
}

export default {
    get: get,
    del: del,
    put: put
}
