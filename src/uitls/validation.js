const validateEmail = (email) => {
    const emailRegex = /^[^/s@]+@[^\s@].[^/s@]+$/
    return emailRegex.test(email)
}

const validatePassword = (password) => {
    return password && password.length > 6
}

module.exports = {validateEmail,validatePassword}