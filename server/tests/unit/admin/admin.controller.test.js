// import * as userController from "../../src/controllers/user.controller.js";
// import * as userService from "../../src/services/user.service.js";
const AdminController = require('../../../src/modules/admin/admin.controller')
const AdminService = require('../../../src/modules/admin/admin.service')
describe("Admin Controller", () => {

  it("should return 201", async () => {
    const mockUser = { username: "Lp", mobile: "8667813980",password:"harshitk" };

    jest.spyOn(AdminService, "createUser")
      .mockResolvedValue(mockUser);

    const req = { body: mockUser };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    conosle.log("res.statusres.status",res.status,res.json)
    await AdminController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

});