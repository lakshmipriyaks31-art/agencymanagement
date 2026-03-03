
const Admin = require("../../../src/modules/admin/admin.model");
const { register } = require("../../../src/modules/admin/admin.service");

jest.mock('../../../src/modules/admin/admin.model')
describe("Admin API Integration", () => {

  console.log("Admin API Itengration")
  describe("Admin Service - Register", () => {
      it("should create a new user", async () => {
      const mockData = { username: "Lp", mobile: "8667813980",password:"harshitk" };

    Admin.findOne.mockResolvedValue(null);
    Admin.create.mockResolvedValue(mockData);
    const result = await register(mockData);
        console.log("result in admin sevice",result)
    expect({username:result.username}).objectContaining(mockData);
    expect(Admin.create).toHaveBeenCalledWith(mockData);
    })
  })

});