const bcrypt = require("bcryptjs");

async function hashPassword(password) {
    const hash = await bcrypt.hash(password, 11);
    return hash;
}

async function validatePassword(password, hash) {
    const isValid = await bcrypt.compare(password, hash);
    return isValid;
}

module.exports = {
    hashPassword,
    validatePassword
};
