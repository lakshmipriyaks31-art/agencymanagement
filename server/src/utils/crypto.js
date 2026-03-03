var CryptoJS = require("crypto-js");
const config = require('./../config/env')
// Encrypt
exports.encryptCrypto = (text) => {
    return CryptoJS.AES.encrypt(text, config.cryptoSecret).toString();
}
// Decrypt
exports.decryptCrypto = (text) => {
    var bytes  = CryptoJS.AES.decrypt(text, config.cryptoSecret);
    return bytes.toString(CryptoJS.enc.Utf8);
}