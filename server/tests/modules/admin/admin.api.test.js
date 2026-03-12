const request = require('supertest')
const app= require('../../../src/app');
const { generateAccessToken, generateRefreshToken } = require('../../../src/utils/jwttoken');
const adminschema = require('../../../src/modules/admin/admin.model');
const { generatepassword } = require('../../../src/utils/bcypt');
const { unprocessable_Entity, adminApi, Created, mobileConflict, Conflict, Unauthorized, invalidToken, ok, commonId, unauthoizedUser, deleted, failedToUpdate, badRequest, notFound, noUserFound } = require('../../../src/config/env');
describe("Admin Api",()=>{
    let createdata,
    accesstoken,
    refreshtoken,
    senddata ={
        username: "lpks",
        password: "12345678",
        mobile: "1234567890",
        role:'admin'
    },
    cookie,
    validationrequireError=[
                            {"username": "Name is required"},
                            {"username": "Name must be at least 3 characters"},
                            {"mobile": "Mobile is required"},
                            {"mobile": "Mobile number must be 10 numbers"},
                            {"password": "Password is required"},
                            {"password": "Password must be at least 6 characters"}
                        ]
    beforeEach(async()=>{
        
        password = await generatepassword(senddata.password)
        createdata =  await adminschema.create({...senddata,password});
        const payload ={adminid:{id:createdata._id,role:createdata.role}}
        accesstoken = generateAccessToken(payload)
        refreshtoken = generateRefreshToken(payload)
        createdata =  await adminschema.findOneAndUpdate({_id:createdata?.id},{$set:{refreshtoken}},{upsert:true})

        cookie = [`accessToken=${accesstoken}`,`refreshToken=${refreshtoken}`]


    })
    describe(`Regiaster Admin - ${adminApi}register`,()=>{
        test("should create Admin with params", async () => {
            const res = await request(app)
                        .post(`${adminApi}register`)
                        .send({...senddata,...{mobile: "1234567881"}});
            console.log("______",res.body)
            expect(res.statusCode).toBe(Created);
            expect(res.body.success).toBe(true);
            

        });
        test("should create Admin without params throws an error", async () => {
            const res = await request(app)
                        .post(`${adminApi}register`)
                        .send();

            expect(res.statusCode).toBe(unprocessable_Entity);
            expect(res.body.success).toBe(false);
            expect(res.body.errors).toEqual(
                expect.arrayContaining(validationrequireError)
            );
        });
        test("should throw validation error while create already exist user ",async()=>{
            const res = await request(app)
                        .post(`${adminApi}register`)
                        .set("Cookie",cookie)
                        .send(senddata)
                        
            expect(res.statusCode).toBe(Conflict)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                    {"mobile":mobileConflict}
                ]))

        })
                
    })
    describe(`Login Admin - ${adminApi}login`,()=>{
        test("Login Admin with params", async () => {
                const res = await request(app)
                            .post(`${adminApi}login`)
                            .send({
                                password: senddata.password,
                                mobile: createdata.mobile
                            });
                expect(res.statusCode).toBe(200);
                expect(res.body.success).toBe(true);
            
        });
        test("login Admin without params throws an error", async () => {
            
            const res = await request(app)
            .post(`${adminApi}login`)
            .send({});

            expect(res.statusCode).toBe(unprocessable_Entity);
        
        });
       
    })
    describe(`All Admin List- ${adminApi}`,()=>{
        test(`get all admin values ${adminApi}`, async () => {
            const res = await request(app)
                        .get(`${adminApi}`)
                        .set("Cookie",cookie)
            expect(res.statusCode).toBe(ok);
            expect(res.body.data.length).toBe(1);
        });
        test(`should throw unauthorized error while get all admin values ${adminApi}`, async () => {
            const res = await request(app)
                        .get(`${adminApi}`)
                        
            expect(res.statusCode).toBe(Unauthorized);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe(invalidToken);
        });
    })
    describe(`Particular Admin List- ${adminApi}`,()=>{
       
         test(`get particular admin values ${adminApi}profile/:id`, async () => {
            const res = await request(app)
                        .get(`${adminApi}profile/${createdata.id}`)
                        .set("Cookie",cookie)
            expect(res.statusCode).toBe(ok);
            expect(res.body.data).not.toBeNull();
        });
        test(`should throw unauthorized user while get all admin values ${adminApi}`, async () => {
            const res = await request(app)
                        .get(`${adminApi}profile/${commonId}`)
                        .set("Cookie",cookie)
                        
            expect(res.statusCode).toBe(Unauthorized);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe(unauthoizedUser);
        });
        test(`should throw invalid or expired token while get all admin values ${adminApi}`, async () => {
            const res = await request(app)
                        .get(`${adminApi}profile/${commonId}`)
                        
            expect(res.statusCode).toBe(Unauthorized);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe(invalidToken);
        });
    })


    describe(`Edit Admin - ${adminApi}:id`,()=>{
        test("Edit Admin with params", async () => {
        
            const res = await request(app)
                        .patch(`${adminApi}${createdata.id}`)
                        .set("Cookie",cookie)
                        .send({...senddata,...{ username: "lpkspriya"}})
            
            expect(res.statusCode).toBe(Created);
            expect(res.body.success).toBe(true);
        });
        test("edit Admin without params throws an error", async () => {
        
            const res = await request(app)
                        .patch(`${adminApi}${createdata.id}`)
                        .set("Cookie",cookie)
            expect(res.statusCode).toBe(unprocessable_Entity);
            
        
        });
        test("edit Admin with already exist mobile number throws an error", async () => {
            let pass = await generatepassword(senddata.password)
            await adminschema.create({...senddata,password:pass,mobile:"1231231231"});
       
            const res = await request(app)
                        .patch(`${adminApi}${createdata.id}`)
                        .set("Cookie",cookie)
                        .send({...senddata,...{ mobile:"1231231231"}})

            expect(res.statusCode).toBe(Conflict);
            expect(res.body.errors).toEqual(
                    expect.arrayContaining([{mobile:mobileConflict}])
            );
        });

        test("should failed to edit Admin beacuse of not matched id ", async () => {
            const res = await request(app)
                        .patch(`${adminApi}${commonId}`)
                        .set("Cookie",cookie)
                        .send({...senddata,...{ mobile:"1231231231"}})

            console.log("fdfsfdfdfd",res.body)
            expect(res.statusCode).toBe(badRequest);
            expect(res.body.message).toBe(failedToUpdate);
        });   
        
        test("should failed to delete Admin beacuse of invalid or expired token ", async () => {
            const res = await request(app)
                        .patch(`${adminApi}${createdata.id}`)
                        .send(senddata)
            expect(res.statusCode).toBe(Unauthorized);
            expect(res.body.message).toBe(invalidToken);
        });  
    })
    describe(`Delete Admin - ${adminApi}:id`,()=>{
        test("should delete Admin", async () => {
            const res = await request(app)
                        .delete(`${adminApi}${createdata.id}`)
                        .set("Cookie",cookie)
            expect(res.statusCode).toBe(deleted);
        });

        test("should failed to delete Admin beacuse of not matched id ", async () => {
            const res = await request(app)
            .delete(`${adminApi}${commonId}`)
            .set("Cookie",cookie)
            expect(res.statusCode).toBe(Unauthorized);
            expect(res.body.message).toBe(unauthoizedUser);
        });   
        
        test("should failed to delete Admin beacuse of invalid or expired token ", async () => {
            const res = await request(app)
            .delete(`${adminApi}${createdata.id}`)
            expect(res.statusCode).toBe(Unauthorized);
            expect(res.body.message).toBe(invalidToken);
        });   
    })
     describe(`Logout Admin - ${adminApi}logout`,()=>{

        test("should failed to logout Admin because of null refreshtoken", async () => {
             await adminschema.findOneAndUpdate({_id:createdata?.id},{$set:{refreshtoken:null}},{upsert:true})
            const res = await request(app)
                        .post(`${adminApi}logout`)
                        .set("Cookie",cookie)
            expect(res.statusCode).toBe(notFound);
            expect(res.body.message).toBe(noUserFound);
        });
        
        test("should logout Admin", async () => {
            const res = await request(app)
                        .post(`${adminApi}logout`)
                        .set("Cookie",cookie)
            expect(res.statusCode).toBe(ok);
        });
        
        test("should failed to logout Admin beacuse of invalid or expired token ", async () => {
            const res = await request(app)
                        .post(`${adminApi}logout`)
            expect(res.statusCode).toBe(Unauthorized);
            expect(res.body.message).toBe(invalidToken);
        });   
    })
})