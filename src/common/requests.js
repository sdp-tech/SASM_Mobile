import { SASM_API_URL } from '@env';
import axios from "axios";
import { getAccessToken, getRefreshToken, removeAccessToken, setAccessToken } from './storage';

export class Request {
    constructor() {
        this.accessToken = getAccessToken()
        this.refreshToken = getRefreshToken()
    }
    default = async (path, body) => {
        const token = this.accessToken;
        const url = SASM_API_URL + path;

        let headerValue;

        if (token === null || 'undefined') {
            headerValue = `No Auth`;
        } else {
            headerValue = `Bearer ${token}`;
        }

        try {
            const response = await body(url, headerValue);
            return response;
        } catch (err) {
            console.log(err.response);
            if (err.response == undefined) {
                // 백엔드와 통신 자체가 실패(ERR_CONNECTION_REFUSED)
                console.log(err);
                alert("ERR_CONNECTION_REFUSED");
                throw err;
            }
            else if (
                err.response.status == 401
            ) {
                // access      토큰이 만료된 경우 또는 로그인이 필요한 기능의 경우
                //만료된 토큰 : "Given token not valid for any token type"
                //없는 토큰 : "자격 인증데이터(authentication credentials)가 제공되지 않았습니다."
                removeAccessToken(); //기존 access token 삭제
                //refresh 토큰을 통해 access 토큰 재발급
                try {
                    const refreshtoken = this.refreshToken._j; // 쿠키에서 id 를 꺼내기
                    const response = await axios.post(
                        SASM_API_URL + "/users/token/refresh/",
                        {
                            refresh: refreshtoken,
                        },
                        {
                            headers: {
                                Authorization: "No Auth",
                            },
                        }
                    );
                    console.log("!!", response);
                    setAccessToken(response.data.access);
                    headerValue = `Bearer ${response.data.access}`;
                } catch (err) {
                    // refresh 토큰이 유효하지 않은 모든 경우(토큰 만료, 토큰 없음 등)
                    console.error(err);
                    return;
                }
                console.log("==============");
                // 새로운 access 토큰으로 API 요청 재수행
                const response = await body(url, headerValue);
                console.log("data?", response);
                return response;

            } else {
                // 백엔드와 통신 자체는 성공, status code가 정상 값 범위 외
                console.log(err);
                throw err;

            }
        }
    }
    get = async (path, params, headers) => {
        return await this.default(path, async (url, headerValue) => {
            const response = await axios.get(
                url,
                {
                    params: params,

                    headers: {
                        Authorization: headerValue,
                        ...headers,
                    },
                }
            );
            console.log("request test => ", response);
            return response;
        });
    }

    post = async (path, data, headers) => {
        return await this.default(path, async (url, headerValue) => {
            const response = await axios.post(
                url,
                data,
                {
                    headers: {
                        Authorization: headerValue,
                        ...headers,
                    },
                }
            );
            console.log("headers", {
                Authorization: headerValue,
                ...headers,
            });
            console.log("request test => ", response);
            return response;
        });
    }

    put = async (path, data, headers) => {
        return await this.default(path, async (url, headerValue) => {
            const response = await axios.put(
                url,
                data,
                {
                    headers: {
                        Authorization: headerValue,
                        ...headers,
                    },
                }
            );
            console.log("request test => ", response);
            return response;
        });
    }

    delete = async (path, params, headers) => {
        return await this.default(path, async (url, headerValue) => {
            const response = await axios.delete(
                url,
                {
                    params: params,

                    headers: {
                        Authorization: headerValue,
                        ...headers,
                    },
                }
            );
            console.log("request test => ", response);
            return response;
        });
    }

    patch = async (path, data, headers) => {
        return await this.default(path, async (url, headerValue) => {
            const response = await axios.patch(
                url,
                data,
                {
                    headers: {
                        Authorization: headerValue,
                        ...headers,
                    },
                }
            );
            console.log("request test => ", response);
            return response;
        });
    }
}