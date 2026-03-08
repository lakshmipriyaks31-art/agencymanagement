const { unauthoizedUser, invalidToken } = require("../../src/config/env");
const authMiddleware = require("../../src/middleware/auth.middleware");
const { verifyRefreshToken, verifyAccessToken } = require("../../src/utils/jwttoken");

jest.mock("../../src/utils/jwttoken");
describe("Auth Middleware",()=>{
 let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {},
      headers: {}
    };
    res = {};
    next = jest.fn();
  });
   test("should return Unauthorized if token missing", () => {

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].message).toBe(unauthoizedUser);

  });


  test("should call next and set req.admin when token valid", () => {

    req.cookies.accessToken = "token123";
    req.cookies.refreshtoken = "refreshtoken123";

    verifyAccessToken.mockReturnValue({
      adminid: { id: "1223" }
    });

    verifyRefreshToken.mockReturnValue({
      adminid: { id: "1223" }
    });

    authMiddleware(req, res, next);

    expect(req.admin).toEqual({ adminid: { id: "1223" } });
    expect(next).toHaveBeenCalledWith();

  });
test("should throw error if token mismatch", () => {

    req.cookies.accessToken = "token123";
    req.cookies.refreshtoken = "refreshtoken123";

    verifyAccessToken.mockReturnValue({
      adminid: { id: "1111" }
    });

    verifyRefreshToken.mockReturnValue({
      adminid: { id: "2222" }
    });

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].message)
      .toBe(unauthoizedUser);

  }); test("should throw error if JWT verification fails", () => {

    req.cookies.accessToken = "token123";
    req.cookies.refreshtoken = "refreshtoken123";

    verifyAccessToken.mockImplementation(() => {
      throw new Error("JWT error");
    });

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].message)
      .toBe(invalidToken);

  });


})