const request = require('supertest')
const app = require("../../../src/app")
const { generatepassword } = require("../../../src/utils/bcypt");
const adminschema = require('../../../src/modules/admin/admin.model')
const productschema = require('../../../src/modules/product/product.model');
const companyschema = require('../../../src/modules/company/company.model');
const { generateAccessToken, generateRefreshToken } = require("../../../src/utils/jwttoken");
const { mobileConflict, Unauthorized, unauthoizedUser, unprocessable_Entity, Created, unauthoizedToken, invalidToken, Conflict, productApi, ok, deleted, commonId, badRequest, failedToUpdate, productConflict, mobileRequired } = require('../../../src/config/env');
describe("=====PRODUCT API======",()=>{
    let productdata = {
        productname:"devankumar",
        code:"india",
        companySlug:"",
        item:[{

        }]
    },  companydata = {
        companyname:"devankumar",
        address:"india",
        mobile:"1234567891",
        code:"devanku",
        owner:"lakshmi"
    },
    admindata = {
            username: "lpks",
            password: "12345678",
            mobile: "1234567890",
            role:'admin'
    },
    accesstoken,
    refreshtoken,
    createProduct,
    createCompany,
    createAdmin,
    cookie,
    validationrequireError=[ {"productname": "Product Name is required"},
                             {"productname": "Product Name must be at least 3 characters"},
                             {"code": "code is required"},
                             {"companySlug": "Company Name is required"}
                            ]
    beforeEach(async()=>{
        // for access and refresh token
        admindata.password = await generatepassword(admindata.password)
        createAdmin = await adminschema.create(admindata)
        const payload = {adminid:{id:createAdmin?.id,role:createAdmin.role}}
        accesstoken = generateAccessToken(payload)
        refreshtoken = generateRefreshToken(payload)
        cookie = [`accessToken=${accesstoken}`,`refreshToken=${refreshtoken}`]
        // create company for id
        createCompany = await companyschema.create(companydata)
        ///common product details creation
        productdata.companySlug=createCompany?.id
        createProduct = await productschema.create(productdata)
    })
    describe(`-------CREATE------\n api:${productApi}\n method:post`,()=>{
        test("should Create Product Details with params ",async()=>{
            const res = await request(app)
                        .post(productApi)
                        .set("Cookie",cookie)
                        .send({...productdata,...{"code":"kishan"}})
                        
            expect(res.statusCode).toBe(Created)
            expect(res.body.success).toBe(true)

        })
         test("should throw validation error while create product ",async()=>{
            const res = await request(app)
                        .post(productApi)
                        .set("Cookie",cookie)
                        .send({})
                    
            expect(res.statusCode).toBe(unprocessable_Entity)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining(validationrequireError)
            );


        })
        test("should throw validation error while create already exist code ",async()=>{
            const res = await request(app)
                        .post(productApi)
                        .set("Cookie",cookie)
                        .send(productdata)
                       
            expect(res.statusCode).toBe(Conflict)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                    {"code":productConflict}
                ]))

        })
        test("should throw unauthorized token while create product",async()=>{
            const res = await request(app)
                        .post(productApi)
                       
                        
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe(invalidToken)
        })
      
    })
    describe(`-------LIST------\n api:${productApi}list\n method:get`,()=>{
        test("should throw unauthorized token before listing product",async()=>{
            const res = await request(app)
                        .get(`${productApi}list`)
                               
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe(invalidToken)
        })
        test("should List created Product Details",async()=>{
            const res = await request(app)
                        .get(`${productApi}list`)
                        .set("Cookie",cookie)
                        
            expect(res.statusCode).toBe(ok)
            expect(res.body.success).toBe(true)

        })
       
        
      
    })
    describe(`-------PARTICULAR PRODUCT LIST------\n api:${productApi}:id\n method:get`,()=>{
        test("should throw unauthorized token before listing product",async()=>{
            const res = await request(app)
                        .get(`${productApi}${createProduct?.id}`)
                               
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe(invalidToken)
        })
        test("should List created Product Details based on id",async()=>{
            const res = await request(app)
                        .get(`${productApi}${createProduct?.id}`)
                        .set("Cookie",cookie)
                       
            expect(res.statusCode).toBe(ok)
            expect(res.body.success).toBe(true)

        })
       
        
      
    })
    describe(`-------EDIT------\n api:${productApi}:id\n method:patch`,()=>{
        test("should Edit Product Details with params ",async()=>{
          
            const res = await request(app)
                        .patch(`${productApi}${createProduct?.id}`)
                        .set("Cookie",cookie)
                        .send({...productdata,...{"productname":"kishan priya"}})
            
            expect(res.statusCode).toBe(Created)
            expect(res.body.success).toBe(true)

        })
         test("should throw validation error while update product ",async()=>{
            const res = await request(app)
                        .patch(`${productApi}${createProduct?.id}`)
                        .set("Cookie",cookie)
                        .send({})
                    
            expect(res.statusCode).toBe(unprocessable_Entity)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining(validationrequireError)
            );


        })
        test("should throw validation error while update already exist user ",async()=>{
            const newProduct = await productschema.create({...productdata,...{"code":"forku"}})
        
            const res = await request(app)
                        .patch(`${productApi}${createProduct?.id}`)
                        .set("Cookie",cookie)
                        .send({...productdata,...{"code":"forku"}})
                       
            expect(res.statusCode).toBe(Conflict)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                    {"code":productConflict}
                ]))

        })
        test("should throw failed to update ",async()=>{

            const res = await request(app)
                        .patch(`${productApi}${commonId}`)
                        .set("Cookie",cookie)
                        .send({...productdata,...{"code":"earnose"}})
                     
            expect(res.statusCode).toBe(badRequest)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                   {error:failedToUpdate}
                ]))

        })
        test("should throw unauthorized token while update product",async()=>{
            const res = await request(app)
                        .patch(`${productApi}${createProduct?.id}`)
                       
                        
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe(invalidToken)
        })
      
    })
    describe(`-------DELETE------\n api:${productApi}${createProduct?.id}\n method:delete`,()=>{
        test("should Delete Product Details  ",async()=>{
          
            const res = await request(app)
                        .delete(`${productApi}${createProduct?.id}`)
                        .set("Cookie",cookie)
            expect(res.statusCode).toBe(deleted)
         
        })
        test("should throw failed to delete ",async()=>{

            const res = await request(app)
                        .delete(`${productApi}${commonId}`)
                        .set("Cookie",cookie)
            
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                   {error:unauthoizedUser}
                ]))

        })
        test("should throw unauthorized token while update product",async()=>{
            const res = await request(app)
                        .delete(`${productApi}${createProduct?.id}`)
                       
                        
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe(invalidToken)
        })
      
    })
})