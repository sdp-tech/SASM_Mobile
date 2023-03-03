import { SASM_API_URL } from '@env';
import axios from "axios";
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
    // get = async(path, params) => {
    //     try {
    //         const response = await axios.get(SASM_API_URL+path, {
    //             params: params,
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 Authorization: "No Auth",
    //             },
    //         });
    //     }
    //     catch (error) {
    //         console.error(error);
    //     }
    //     return response;
    // }
}