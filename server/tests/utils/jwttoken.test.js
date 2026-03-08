const { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } = require("../../src/utils/jwttoken")

describe("JWT TOKEN Utility",()=>{
    describe("generate access token",()=>{
        test("should generate access token",()=>{
            const payload = {
                admin:{
                    adminid:"1223",
                    mobile:"1234567890"
                }
            }
            const genAccess = generateAccessToken(payload)
            expect(typeof genAccess).toBe("string")
            expect(genAccess).not.toBe(payload)
        })
    })
     describe("generate refresh token",()=>{
        test("should generate refresh token",()=>{
            const payload = {
                admin:{
                    adminid:"1223",
                    mobile:"1234567890"
                }
            }
            const genAccess = generateRefreshToken(payload)
            expect(typeof genAccess).toBe("string")
            expect(genAccess).not.toBe(payload)
        })
    })
    describe("verify the generated access token",()=>{
        test("should verify the generated access token",()=>{
            const payload = {
                admin:{
                    adminid:"1223",
                    mobile:"1234567890"
                }
            }
            const genAccess = generateAccessToken(payload)
            const verifyAccess = verifyAccessToken(genAccess)
            expect(verifyAccess.admin).toEqual(payload.admin)
        })
     test("should throw error for invalid access token", () => {

    expect(() => verifyAccessToken("invalidtoken"))
      .toThrow();

  });
    })
    describe("verify the generated refresh token",()=>{
        test("should verify the generated refresh token",()=>{
            const payload = {
                admin:{
                    adminid:"1223",
                    mobile:"1234567890"
                }
            }
            const genAccess = generateRefreshToken(payload)
            const verifyAccess = verifyRefreshToken(genAccess)
            expect(verifyAccess.admin).toEqual(payload.admin)
        })
           test("should throw error for invalid refresh token", () => {

    expect(() => verifyRefreshToken("invalidtoken"))
      .toThrow();

  });
    })
})