const { encryptCrypto, decryptCrypto } = require("../../src/utils/crypto");

describe("Crypto-js Utilities",()=>{
    describe("Encrypt the data",()=>{
        test("should encrypt the data",()=>{
        const value = "kishan";
        const encData = encryptCrypto(value)
        expect(typeof encData).toBe("string")
        expect(encData).not.toBe(value)
        })
    })
     describe("Decrypt the Encrypted data ",()=>{
        test("should decrypt the encrypted data returns actual value",()=>{
        const value = "kishan";
        const encData = encryptCrypto(value)
        const decData = decryptCrypto(encData)
        expect(decData).toBe(value)
        })
        test("should decrypt the encrypted data returns wrong value",()=>{
        const value = "kishan";
        const decData = decryptCrypto("wrongvalue")
        expect(decData).not.toBe(value)
        })
    })
})