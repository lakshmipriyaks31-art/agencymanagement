const {generatepassword,comparePassword} = require('../../src/utils/bcypt')

describe("bcrypt Utility",()=>{
describe("generate the password",()=>{
    test("should generate the hashed password",async()=>{
        const password = "kishank"
        const hashedpassword = await generatepassword(password)
        expect(typeof hashedpassword).toBe("string");
        expect(hashedpassword).not.toBe(password)
    })
})
describe("Compare generated password",()=>{
    test("should create the hashed password and compare the password is true",async()=>{
        const password = "kishank"
        const hashedpassword = await generatepassword(password)
        const comparepassword = await comparePassword(password,hashedpassword)
        expect(comparepassword).toBe(true);
    })
    test("should create the hashed password and compare the password is false",async()=>{
        const password = "kishank"
        const hashedpassword = await generatepassword(password)
        const comparepassword = await comparePassword("wrongPpassword",hashedpassword)
        expect(comparepassword).toBe(false);
    })
})
})
