const request = require('supertest')
const app = require("../../../src/app")
const { generatepassword } = require("../../../src/utils/bcypt");
const adminschema = require('../../../src/modules/admin/admin.model')
const orderschema = require('../../../src/modules/order/order.model');
const companyschema = require('../../../src/modules/company/company.model');
const productschema = require('../../../src/modules/product/product.model');
const clientschema = require('../../../src/modules/client/client.model');

const { generateAccessToken, generateRefreshToken } = require("../../../src/utils/jwttoken");
const { mobileConflict, Unauthorized, unauthoizedUser, unprocessable_Entity, Created, unauthoizedToken, invalidToken, Conflict, orderApi, ok, deleted, commonId, badRequest, failedToUpdate, orderConflict, mobileRequired } = require('../../../src/config/env');
describe("=====ORDER API======",()=>{
    let productdata = {
        productname:"devankumar",
        code:"india",
        companySlug:"",
        item:[{

        }]
    }, orderdata = {
        orderId:"1",
        companyId:"",
        clientId:"",
        item:[]
    },  companydata = {
        companyname:"devankumar",
        address:"india",
        mobile:"1234567891",
        code:"devanku",
        owner:"lakshmi"
    },clientdata = {
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
    createOrder,
    createProduct,
    createCompany,
    createAdmin,
    cookie,
    validationrequireError=[ {"companyId": "Company Name is required"},
                             {"clientId": "Client Name is required"}
                            ]
    beforeEach(async()=>{
        // for access and refresh token
        admindata.password = await generatepassword(admindata.password)
        createAdmin = await adminschema.create(admindata)
        const payload = {adminid:{id:createAdmin?.id,role:createAdmin.role}}
        accesstoken = generateAccessToken(payload)
        refreshtoken = generateRefreshToken(payload)
        cookie = [`accessToken=${accesstoken}`,`refreshToken=${refreshtoken}`]
        // create product for id
        createCompany = await companyschema.create(companydata)
        productdata.companySlug=createCompany?.id
       
        createProduct = await productschema.create(productdata)
        createClient = await clientschema.create(clientdata)
        ///common order details creation
        
        orderdata.companyId=productdata.companySlug,
        orderdata.clientId=createClient.id,
        orderdata.item=[{
            productId:createProduct.id
        }]
        createOrder = await orderschema.create(orderdata)
    })
    describe(`-------CREATE------\n api:${orderApi}\n method:post`,()=>{
        test("should Create Order Details with params ",async()=>{
            const res = await request(app)
                        .post(orderApi)
                        .set("Cookie",cookie)
                        .send({...orderdata,...{"code":"kishan"}})
                        console.log("___",res.body)
            expect(res.statusCode).toBe(Created)
            expect(res.body.success).toBe(true)

        })
         test("should throw validation error while create order ",async()=>{
            const res = await request(app)
                        .post(orderApi)
                        .set("Cookie",cookie)
                        .send({})
                    
            expect(res.statusCode).toBe(unprocessable_Entity)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining(validationrequireError)
            );


        })
        test("should throw unauthorized token while create order",async()=>{
            const res = await request(app)
                        .post(orderApi)
                       
                        
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe(invalidToken)
        })
      
    })
    describe(`-------LIST------\n api:${orderApi}list\n method:get`,()=>{
        test("should throw unauthorized token before listing order",async()=>{
            const res = await request(app)
                        .get(`${orderApi}list`)
                               
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe(invalidToken)
        })
        test("should List created Order Details",async()=>{
            const res = await request(app)
                        .get(`${orderApi}list`)
                        .set("Cookie",cookie)
                        
            expect(res.statusCode).toBe(ok)
            expect(res.body.success).toBe(true)

        })
       
        
      
    })
    describe(`-------PARTICULAR ORDER LIST------\n api:${orderApi}:id\n method:get`,()=>{
        test("should throw unauthorized token before listing all order",async()=>{
            const res = await request(app)
                        .get(`${orderApi}${createOrder?.id}`)
                               
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe(invalidToken)
        })
        test("should List created Order Details based on id",async()=>{
            const res = await request(app)
                        .get(`${orderApi}${createOrder?.id}`)
                        .set("Cookie",cookie)
                        console.log("retreter",res.body)
            expect(res.statusCode).toBe(ok)
            expect(res.body.success).toBe(true)

        })
       
        
      
    })
    describe(`-------EDIT------\n api:${orderApi}:id\n method:patch`,()=>{
        test("should Edit Order Details with params ",async()=>{
          
            const res = await request(app)
                        .patch(`${orderApi}${createOrder?.id}`)
                        .set("Cookie",cookie)
                        .send({...orderdata,...{"ordername":"kishan priya"}})
            console.log("|res",res.body)
            expect(res.statusCode).toBe(Created)
            expect(res.body.success).toBe(true)

        })
         test("should throw validation error while update order ",async()=>{
            const res = await request(app)
                        .patch(`${orderApi}${createOrder?.id}`)
                        .set("Cookie",cookie)
                        .send({})
                    
            expect(res.statusCode).toBe(unprocessable_Entity)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining(validationrequireError)
            );


        })
        test("should throw failed to update ",async()=>{

            const res = await request(app)
                        .patch(`${orderApi}${commonId}`)
                        .set("Cookie",cookie)
                        .send({...orderdata})
                console.log("resresres",res.body,commonId,createOrder?._id)       
            expect(res.statusCode).toBe(badRequest)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                   {error:failedToUpdate}
                ]))

        })
        test("should throw unauthorized token while update order",async()=>{
            const res = await request(app)
                        .patch(`${orderApi}${createOrder?.id}`)
                       
                        
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe(invalidToken)
        })
      
    })
    describe(`-------DELETE------\n api:${orderApi}${createOrder?.id}\n method:delete`,()=>{
        test("should Delete Order Details  ",async()=>{
          
            const res = await request(app)
                        .delete(`${orderApi}${createOrder?.id}`)
                        .set("Cookie",cookie)
            expect(res.statusCode).toBe(deleted)
         
        })
        test("should throw failed to delete ",async()=>{

            const res = await request(app)
                        .delete(`${orderApi}${commonId}`)
                        .set("Cookie",cookie)
            
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                   {error:unauthoizedUser}
                ]))

        })
        test("should throw unauthorized token while update order",async()=>{
            const res = await request(app)
                        .delete(`${orderApi}${createOrder?.id}`)
                       
                        
            expect(res.statusCode).toBe(Unauthorized)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe(invalidToken)
        })
      
    })
})