const request =  require('supertest')
const app = require("../../../src/app.js")
describe("Admin API", () => {

  it("POST /api/admin should create user", async () => {

    const response = await request(app)
      .post(`/api/admin`)
      .send({ username: "Lp", mobile: "8667813980",password:"harshitk" });
    console.log("response",response.statusCode,response.body)
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe("Lp");
  });

});