export function getUserInfo(username) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({useInfo: username + 'yepi', code: 1, token: 'abcd'})
        }, 1000);
    })
}

export function getValidator() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({useInfo: 'yepi2', code: 1, token: 'abcdef'})
        }, 1000);
    })
}