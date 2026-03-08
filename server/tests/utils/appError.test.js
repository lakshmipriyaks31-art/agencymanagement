const { badRequest, unprocessable_Entity, internalserver } = require('../../src/config/env');
const AppError = require('../../src/utils/appError');

describe('AppError Utility',()=>{
    it('should throw error response with default value',()=>{
         const error = new AppError("Something went wrong",  badRequest,{error:"Something went wrong"});
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("Something went wrong");
            expect(error.statusCode).toBe(400);
            // expect(error.statusCode).toBe(500);
    })
    test("should throw error authurizatiob failed",()=>{
        const error = new AppError("Bad Request",badRequest,{"user":"user authorization failed"})
            expect(error).toBeInstanceOf(Error);
           expect(error.errors).toEqual({user:"user authorization failed"})
        expect(error.statusCode).toBe(400)
        expect(error.message).toBe("Bad Request")
    })
      test("should store errors object if provided", () => {

    const errorDetails = {error:[{ email: "Email is required" }]};

    const error = new AppError(
      "Validation failed",
      unprocessable_Entity,
      errorDetails
    );

    expect(error.message).toBe("Validation failed");
    expect(error.statusCode).toBe(422);
    expect(error.errors).toEqual(errorDetails);
  });

  test("should not have errors property if not provided", () => {

    const error = new AppError("Only message", internalserver,null);

    expect(error.errors).toBeNull();
  });
})