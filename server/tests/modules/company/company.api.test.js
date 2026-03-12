const request = require('supertest')
const app = require("../../../src/app")
const { generatepassword } = require("../../../src/utils/bcypt");
const adminschema = require('../../../src/modules/admin/admin.model')
const companyschema = require('../../../src/modules/company/company.model');
const productschema = require('../../../src/modules/product/product.model');

const { generateAccessToken, generateRefreshToken } = require("../../../src/utils/jwttoken");
const { mobileConflict, Unauthorized, unauthoizedUser, unprocessable_Entity, Created, unauthoizedToken, invalidToken, Conflict, companyApi, ok, deleted, commonId, badRequest, failedToUpdate, slugConflict, mobileRequired } = require('../../../src/config/env');
describe("=====COMPANY API======",()=>{
    let companydata = {
        companyname:"devankumar",
        address:"india",
        mobile:"1234567891",
        slug:"devanku",
        owner:"lakshmi"
    },
     productdata = {
        productname:"devankumar",
        code:"india",
        companySlug:"",
        item:[{

        }]
    },
    admindata = {
            username: "lpks",
            password: "12345678",
            mobile: "1234567890",
            role:'admin'
    },
    accesstoken,
    refreshtoken,
    createCompany,
    createAdmin,
    cookie,
    validationrequireError=[  {"companyname": "Company Name is required"}, 
                    {"companyname": "Company Name must be at least 3 characters"}, {"owner": "Owner Name is required"}, 
                    {"owner": "Owner Name must be at least 3 characters"}, 
                    {"mobile": "Mobile is required"}, 
                    {"slug": "Slug is required"}, 
                    {"mobile": "Mobile number must be 10 numbers"}
                ]
    beforeEach(async()=>{
        // for access and refresh token
        admindata.password = await generatepassword(admindata.password)
        createAdmin = await adminschema.create(admindata)
        const payload = {adminid:{id:createAdmin?.id,role:createAdmin.role}}
        accesstoken = generateAccessToken(payload)
        refreshtoken = generateRefreshToken(payload)
        cookie = [`accessToken=${accesstoken}`,`refreshToken=${refreshtoken}`]
        ///common company details creation
        createCompany = await companyschema.create(companydata)
        productdata.companySlug=createCompany?.id
        createProduct = await productschema.create(productdata)
   
    })
    describe(`-------CREATE------\n api:${companyApi}\n method:post`,()=>{
        test("should Create Company Details with params ",async()=>{
            const res = await request(app)
                        .post(companyApi)
                        .set("Cookie",cookie)
                        .send({...companydata,...{"slug":"kishan"}})
            expect(res.statusCode).toBe(Created)
            expect(res.body.success).toBe(true)

        })
         test("should throw validation error while create company ",async()=>{
            const res = await request(app)
                        .post(companyApi)
                        .set("Cookie",cookie)
                        .send({})
                    
            expect(res.statusCode).toBe(unprocessable_Entity)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining(validationrequireError)
            );


        })
        test("should throw validation error while create already exist slug ",async()=>{
            const res = await request(app)
                        .post(companyApi)
                        .set("Cookie",cookie)
                        .send(companydata)
                       
            expect(res.statusCode).toBe(Conflict)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                    {"slug":slugConflict}
                ]))

        })
        test("should throw unauthorized token while create company",async()=>{
            const res = await request(app)
                        .post(companyApi)
                       
                        
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe(invalidToken)
        })
      
    })
    describe(`-------LIST------\n api:${companyApi}list\n method:get`,()=>{
        test("should throw unauthorized token before listing company",async()=>{
            const res = await request(app)
                        .get(`${companyApi}list`)
                               
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe(invalidToken)
        })
        test("should List created Company Details",async()=>{
            const res = await request(app)
                        .get(`${companyApi}list`)
                        .set("Cookie",cookie)
                        
            expect(res.statusCode).toBe(ok)
            expect(res.body.success).toBe(true)

        })
       
        
      
    })
    describe(`-------PARTICULAR COMPANY LIST------\n api:${companyApi}:id\n method:get`,()=>{
        test("should throw unauthorized token before listing company",async()=>{
            const res = await request(app)
                        .get(`${companyApi}${createCompany?.id}`)
                               
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe(invalidToken)
        })
        test("should List created Company Details based on id",async()=>{
            const res = await request(app)
                        .get(`${companyApi}${createCompany?.id}`)
                        .set("Cookie",cookie)
            expect(res.statusCode).toBe(ok)
            expect(res.body.success).toBe(true)

        })
       
        
      
    })
    describe(`-------EDIT------\n api:${companyApi}:id\n method:patch`,()=>{
        test("should Edit Company Details with params ",async()=>{
          
            const res = await request(app)
                        .patch(`${companyApi}${createCompany?.id}`)
                        .set("Cookie",cookie)
                        .send({...companydata,...{"companyname":"kishan priya"}})
            
            expect(res.statusCode).toBe(Created)
            expect(res.body.success).toBe(true)

        })
         test("should throw validation error while update company ",async()=>{
            const res = await request(app)
                        .patch(`${companyApi}${createCompany?.id}`)
                        .set("Cookie",cookie)
                        .send({})
                    
            expect(res.statusCode).toBe(unprocessable_Entity)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining(validationrequireError)
            );


        })
        test("should throw validation error while update already exist user ",async()=>{
            const newCompany = await companyschema.create({...companydata,...{"slug":"forku"}})
        
            const res = await request(app)
                        .patch(`${companyApi}${createCompany?.id}`)
                        .set("Cookie",cookie)
                        .send({...companydata,...{"slug":"forku"}})
                       
            expect(res.statusCode).toBe(Conflict)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                    {"slug":slugConflict}
                ]))

        })
        test("should throw failed to update ",async()=>{

            const res = await request(app)
                        .patch(`${companyApi}${commonId}`)
                        .set("Cookie",cookie)
                        .send({...companydata,...{"slug":"earnose"}})
                   
            expect(res.statusCode).toBe(badRequest)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                   {error:failedToUpdate}
                ]))

        })
        test("should throw unauthorized token while update company",async()=>{
            const res = await request(app)
                        .patch(`${companyApi}${createCompany?.id}`)
                       
                        
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe(invalidToken)
        })
      
    })
    describe(`-------DELETE------\n api:${companyApi}${createCompany?.id}\n method:delete`,()=>{
        test("should Delete Company Details  ",async()=>{
          
            const res = await request(app)
                        .delete(`${companyApi}${createCompany?.id}`)
                        .set("Cookie",cookie)
            expect(res.statusCode).toBe(deleted)
         
        })
        test("should throw failed to delete ",async()=>{

            const res = await request(app)
                        .delete(`${companyApi}${commonId}`)
                        .set("Cookie",cookie)
            
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                   {error:unauthoizedUser}
                ]))

        })
        test("should throw unauthorized token while delete company",async()=>{
            const res = await request(app)
                        .delete(`${companyApi}${createCompany?.id}`)
                       
                        
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe(invalidToken)
        })
      
    })
})