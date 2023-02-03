import Cookies from 'js-cookie';

const TokenKey = 'admin_token';
const user = 'Yepi-bit';

export default function getToken() {
    return Cookies.get(TokenKey);
}

export function setToken(token) {
    return Cookies.set(TokenKey, token);
}

export function removeToken() {
    return Cookies.remove(TokenKey);
}

export function getUserName() {
    return Cookies.get(user);
}

export function setUserName(params) {
    return Cookies.set(user, params, { expires: 7 });
}

export function removeUserName() {
    return Cookies.remove(user);
}
