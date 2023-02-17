import { SASM_API_URL } from '@env';

import { getAccessToken, getRefreshToken } from './storage';

export class Request {
    constructor() {
        this.accessToken = getAccessToken()
        this.refreshToken = getRefreshToken()
    }

    post = async (path, data, headers) => {
        return await fetch(SASM_API_URL + path, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify({
                ...data
            }),
        });
    }
}