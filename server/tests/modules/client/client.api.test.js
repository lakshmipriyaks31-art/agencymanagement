const request = require('supertest')
const app = require("../../../src/app")
const { generatepassword } = require("../../../src/utils/bcypt");
const adminschema = require('../../../src/modules/admin/admin.model')
const clientschema = require('../../../src/modules/client/client.model');
const { generateAccessToken, generateRefreshToken } = require("../../../src/utils/jwttoken");
const { mobileConflict, Unauthorized, unauthoizedUser, unprocessable_Entity, Created, unauthoizedToken, invalidToken, Conflict, clientApi, ok, deleted, commonId, badRequest, failedToUpdate } = require('../../../src/config/env');
describe("=====CLIENT API======",()=>{
    let clientdata = {
        clientname:"devankumar",
        address:"india",
        mobile:"1234567891"
    },
    admindata = {
            username: "lpks",
            password: "12345678",
            mobile: "1234567890",
            role:'admin'
    },
    accesstoken,
    refreshtoken,
    createClient,
    createAdmin,
    cookie;
    beforeEach(async()=>{
        // for access and refresh token
        admindata.password = await generatepassword(admindata.password)
        createAdmin = await adminschema.create(admindata)
        const payload = {adminid:{id:createAdmin?.id,role:createAdmin.role}}
        accesstoken = generateAccessToken(payload)
        refreshtoken = generateRefreshToken(payload)
        cookie = [`accessToken=${accesstoken}`,`refreshToken=${refreshtoken}`]
        ///common client details creation
        createClient = await clientschema.create(clientdata)
    })
    describe(`-------CREATE------\n api:${clientApi}\n method:post`,()=>{
        test("should Create Client Details with params ",async()=>{
            const res = await request(app)
                        .post(clientApi)
                        .set("Cookie",cookie)
                        .send({...clientdata,...{"mobile":"1234561231"}})
            expect(res.statusCode).toBe(Created)
            expect(res.body.success).toBe(true)

        })
         test("should throw validation error while create client ",async()=>{
            const res = await request(app)
                        .post(clientApi)
                        .set("Cookie",cookie)
                        .send({})
                    
            expect(res.statusCode).toBe(unprocessable_Entity)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                { "clientname": "Client Name is required" },
                { "mobile": "Mobile is required" }
                ])
            );


        })
        test("should throw validation error while create already exist user ",async()=>{
            const res = await request(app)
                        .post(clientApi)
                        .set("Cookie",cookie)
                        .send(clientdata)
                       
            expect(res.statusCode).toBe(Conflict)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                    {"mobile":mobileConflict}
                ]))

        })
        test("should throw unauthorized token while create client",async()=>{
            const res = await request(app)
                        .post(clientApi)
                       
                        
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe(invalidToken)
        })
      
    })
    describe(`-------LIST------\n api:${clientApi}list\n method:get`,()=>{
        test("should throw unauthorized token before listing client",async()=>{
            const res = await request(app)
                        .get(`${clientApi}list`)
                               
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe(invalidToken)
        })
        test("should List created Client Details",async()=>{
            const res = await request(app)
                        .get(`${clientApi}list`)
                        .set("Cookie",cookie)
                        
            expect(res.statusCode).toBe(ok)
            expect(res.body.success).toBe(true)

        })
       
        
      
    })
    describe(`-------PARTICULAR CLIENT LIST------\n api:${clientApi}:id\n method:get`,()=>{
        test("should throw unauthorized token before listing client",async()=>{
            const res = await request(app)
                        .get(`${clientApi}${createClient.id}`)
                               
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe(invalidToken)
        })
        test("should List created Client Details based on id",async()=>{
            const res = await request(app)
                        .get(`${clientApi}${createClient.id}`)
                        .set("Cookie",cookie)
                        console.log("retreter",res.body)
            expect(res.statusCode).toBe(ok)
            expect(res.body.success).toBe(true)

        })
       
        
      
    })
    describe(`-------EDIT------\n api:${clientApi}:id\n method:patch`,()=>{
        test("should Edit Client Details with params ",async()=>{
          
            const res = await request(app)
                        .patch(`${clientApi}${createClient.id}`)
                        .set("Cookie",cookie)
                        .send({...clientdata,...{"clientname":"kishan priya"}})
            expect(res.statusCode).toBe(Created)
            expect(res.body.success).toBe(true)

        })
         test("should throw validation error while update client ",async()=>{
            const res = await request(app)
                        .patch(`${clientApi}${createClient.id}`)
                        .set("Cookie",cookie)
                        .send({})
                    
            expect(res.statusCode).toBe(unprocessable_Entity)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                { "clientname": "Client Name is required" },
                { "mobile": "Mobile is required" }
                ])
            );


        })
        test("should throw validation error while update already exist user ",async()=>{
            const newClient = await clientschema.create({...clientdata,...{"mobile":"9876543210"}})
        
            const res = await request(app)
                        .patch(`${clientApi}${createClient.id}`)
                        .set("Cookie",cookie)
                        .send({...clientdata,...{"mobile":"9876543210"}})
                       
            expect(res.statusCode).toBe(Conflict)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                    {"mobile":mobileConflict}
                ]))

        })
        test("should throw failed to update ",async()=>{

            const res = await request(app)
                        .patch(`${clientApi}${commonId}`)
                        .set("Cookie",cookie)
                        .send({...clientdata,...{"mobile":"1231231231"}})
                console.log("resresres",res.body,commonId,createClient._id)       
            expect(res.statusCode).toBe(badRequest)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                   {error:failedToUpdate}
                ]))

        })
        test("should throw unauthorized token while update client",async()=>{
            const res = await request(app)
                        .patch(`${clientApi}${createClient.id}`)
                       
                        
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe(invalidToken)
        })
      
    })
    describe(`-------DELETE------\n api:${clientApi}${createClient?.id}\n method:delete`,()=>{
        test("should Delete Client Details  ",async()=>{
          
            const res = await request(app)
                        .delete(`${clientApi}${createClient.id}`)
                        .set("Cookie",cookie)
            expect(res.statusCode).toBe(deleted)
         
        })
        test("should throw failed to delete ",async()=>{

            const res = await request(app)
                        .delete(`${clientApi}${commonId}`)
                        .set("Cookie",cookie)
            
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                   {error:unauthoizedUser}
                ]))

        })
        test("should throw unauthorized token while update client",async()=>{
            const res = await request(app)
                        .delete(`${clientApi}${createClient.id}`)
                       
                        
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe(invalidToken)
        })
      
    })
})