import * as Keychain from 'react-native-keychain';


async function getSecureValue(key) {
    const result = await Keychain.getInternetCredentials(key)
    if (result) {
        return result.password
    }
    return false
}

function setSecureValue(key, value) {
    Keychain.setInternetCredentials(key, key /* <- can be a random string */, value)
}


function removeSecureValue(key) {
    Keychain.resetInternetCredentials(key)
}

const nicknameKeyName = 'nickname'
const accessTokenKeyName = 'accessToken'
const refreshTokenKeyName = 'refreshToken'

export async function getNickname() {
    return await getSecureValue(nicknameKeyName)
}

export function setNickname(nickname) {
    setSecureValue(nicknameKeyName, nickname)
}

export function removeNickname() {
    removeSecureValue(nicknameKeyName)
}

export async function getAccessToken() {
    return await getSecureValue(accessTokenKeyName)
}

export function setAccessToken(token) {
    setSecureValue(accessTokenKeyName, token)
}

export function removeAccessToken() {
    removeSecureValue(accessTokenKeyName)
}

export async function getRefreshToken() {
    return await getSecureValue(refreshTokenKeyName)
}

export function setRefreshToken(token) {
    setSecureValue(refreshTokenKeyName, token)
}

export function removeRefreshToken() {
    removeSecureValue(refreshTokenKeyName)
}
