const { adminRoleAuth } = require("../../src/middleware/roleAuth.middleware")

describe("Role Auth Middleware",()=>{
   beforeEach(()=>{
    req= {
        admin:{adminid:{role:"admin"}} 
    },
    res={},
    next = jest.fn()
   })
    test("should move next function when the user is authorized",()=>{
        adminRoleAuth(req,res,next)
        expect(next).toHaveBeenCalled() 
    })
    test("should throw error when the user is not authorized",()=>{
        req.admin.adminid.role = "user"
        expect(()=>{

            adminRoleAuth(req,res,next)
        }).toThrow()
    })
   
})