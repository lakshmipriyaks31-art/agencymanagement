const { Conflict, unprocessable_Entity } = require("../../src/config/env");
const validationMiddleware = require("../../src/middleware/validation.middleware")
const { validationResult } = require("express-validator");
jest.mock("express-validator")
describe("validation Middleware",()=>{
    beforeEach(()=>{
        req={},
        res={},
        next=jest.fn()
    })
    test("should have validation error",()=>{
       
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [
        { path: "mobile", msg: "mobile is required" },
        { path: "password", msg: "Password is required" }
      ]
    });

    validationMiddleware(req, res, next);

    const errorPassed = next.mock.calls[0][0];
    
    expect(errorPassed.errors).toEqual(
      expect.arrayContaining([
        { mobile: 'mobile is required' },
      { password: 'Password is required' }
      ])
    );

    expect(errorPassed.statusCode).toBe(unprocessable_Entity);

    })
    test("should have no validation errors",()=>{
         validationResult.mockReturnValue({
      isEmpty: () => true
    });

    validationMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
    })
})