const errorMiddleware = require("../../src/middleware/error.middleware")
describe("Error Middleware",()=>{
    let req, res, next;

  beforeEach(() => {
    req = {
      originalUrl: "/api/test"
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
    test("should send correct error response when the email is required",()=>{
        const error = {
            message:"Validation failed",
            success:false,
            statusCode : 400,
            errors:{"email":"EmailId is required"}
        }
        errorMiddleware(error,req,res,next)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith( {
            message:"Validation failed",
            success:false,
            errors:{"email":"EmailId is required"}
        });
    })
     test("should return default values when error fields missing",()=>{
        const error = {}
        errorMiddleware(error,req,res,next)
         expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith( {
              message:"Internal Server Error",
            success:false,
            errors:null
        });
    })
})