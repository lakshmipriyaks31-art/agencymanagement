const request = require('supertest')
const app= require('../../../src/app');
const { generateAccessToken, generateRefreshToken } = require('../../../src/utils/jwttoken');
const adminschema = require('../../../src/modules/admin/admin.model');
const { generatepassword } = require('../../../src/utils/bcypt');
const { unprocessable_Entity } = require('../../../src/config/env');
describe("Admin Api",()=>{
    let createdata,accestoken,refreshtoken
        let senddata ={
            username: "lp",
            password: "12345678",
            mobile: "1234567890",
            role:'admin'
        }
    beforeEach(async()=>{
        
        let password =await generatepassword(senddata.password)
    createdata =  await adminschema.create({...senddata,password});
        const payload ={adminid:{id:createdata._id,role:createdata.role}}
                accestoken = generateAccessToken(payload)
                refreshtoken = generateRefreshToken(payload)

    })
    describe("Regiaster Admin - /api/admin/register",()=>{
    test("Create Admin with params", async () => {
        const res = await request(app)
        .post("/api/admin/register")
        .send({
            username: "lpkspriya",
            password: "12345678",
            mobile: "1234567891"
        });
        
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
            const admin = await adminschema.findOne({  mobile: "1234567891"});
        expect(admin).not.toBeNull();

    });
    test("Create Admin without params throws an error", async () => {
        const res = await request(app)
        .post("/api/admin/register")
        .send({
            username: "",
            password: "12345678",
            mobile: "1234567890"
        });

    expect(res.statusCode).toBe(unprocessable_Entity);
    
    });
})
describe("Login Admin - /api/admin/login",()=>{
    test("Login Admin with params", async () => {
            const res = await request(app)
        .post("/api/admin/login")
        .send({
            password: senddata.password,
            mobile: createdata.mobile
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        
    });
    test("login Admin without params throws an error", async () => {
        
        const res = await request(app)
        .post("/api/admin/login")
        .send({});

        expect(res.statusCode).toBe(unprocessable_Entity);
    
    });
})
    test("get all admin values /api/admin/", async () => {


    const res = await request(app)
        .get("/api/admin/")
        .set("Cookie",[
            `accessToken=${accestoken}`,
            `refreshToken=${refreshtoken}`
        ])
        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);

});


describe("Edit Admin - /api/admin/:id",()=>{
    test("Edit Admin with params", async () => {
    
        const res = await request(app)
        .patch(`/api/admin/${createdata.id}`)
        .set("Cookie",[
            `accessToken=${accestoken}`,
            `refreshToken=${refreshtoken}`
        ])
        .send({
            password: senddata.password,
            mobile: senddata.mobile,
            username: "lpkspriya",
        })
        
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
    });
    test("edit Admin without params throws an error", async () => {
    
        const res = await request(app)
        .patch(`/api/admin/${createdata.id}`)
        .set("Cookie",[
            `accessToken=${accestoken}`,
            `refreshToken=${refreshtoken}`
        ])
        expect(res.statusCode).toBe(unprocessable_Entity);
    
    });
})
describe("Delete Admin - /api/admin/:id",()=>{
test("should delete Admin with /api/admin/:id", async () => {
    
        const res = await request(app)
        .delete(`/api/admin/${createdata.id}`)
        .set("Cookie",[
            `accessToken=${accestoken}`,
            `refreshToken=${refreshtoken}`
        ])
        expect(res.statusCode).toBe(204);

    });
test("should failed to delete Admin beacuse of not matched id with /api/admin/:id", async () => {
    
        const res = await request(app)
        .delete(`/api/admin/${"69abc73f12e5a54548d2b410"}`)
        .set("Cookie",[
            `accessToken=${accestoken}`,
            `refreshToken=${refreshtoken}`
        ])
        expect(res.statusCode).toBe(401);

});    
})
})