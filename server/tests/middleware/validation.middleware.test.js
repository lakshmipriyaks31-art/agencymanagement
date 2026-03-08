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
     {"mobile": "mobile is required" },
        {  "password": "Password is required" }
      ]
    });

    validationMiddleware(req, res, next);

    const errorPassed = next.mock.calls[0][0];
    // console.log("next.mock",next.mock.calls)
    expect(errorPassed.errors).toBe(
    ([
        {"mobile": "mobile is required" },
        {  "password": "Password is required" }
      ])
    );

    expect(errorPassed.statusCode).toBe(400);

    })
    test("should have no validation errors",()=>{
         validationResult.mockReturnValue({
      isEmpty: () => true
    });

    validationMiddleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
    })
})