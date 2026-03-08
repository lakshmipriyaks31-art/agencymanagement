const ApiResponse = require("../../src/utils/apiResponse");

describe("ApiResponse Utility", () => {

  test("should send success response with default values", () => {

    // Mock res object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const data = { username: "devan" };

   ApiResponse.success(res, data, "Created", 201);

    // Check status
    expect(res.status).toHaveBeenCalledWith(201);

    // Check json response
    expect(res.json).toHaveBeenCalledWith({
      success: true,
       message: JSON.stringify("Created"),
      data: data
    });

  });

});