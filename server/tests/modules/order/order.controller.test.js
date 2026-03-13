const orderController = require('../../../src/modules/order/order.controller')
const orderService = require('../../../src/modules/order/order.service')
const validationMiddleware = require('../../../src/middleware/validation.middleware')

const productschema = require('../../../src/modules/product/product.model')
const adminschema = require('../../../src/modules/admin/admin.model')
const clientschema = require('../../../src/modules/client/client.model')
const companyschema = require('../../../src/modules/company/company.model')
const orderschema = require('../../../src/modules/order/order.model')
const { generatepassword } = require('../../../src/utils/bcypt')
const { generateAccessToken, generateRefreshToken } = require('../../../src/utils/jwttoken')
const { Created, unprocessable_Entity, mobileConflict, Conflict, validationError, ok, noUserFound, invalidToken, Unauthorized, notFound, commonId, unauthoizedUser, deleted, failedToUpdate, badRequest } = require('../../../src/config/env')
const AppError = require('../../../src/utils/appError')

jest.mock('../../../src/modules/order/order.service')
jest.mock('../../../src/middleware/validation.middleware')
describe("----------order Controller--------",()=>{
    let createdata,
    accesstoken,
    refreshtoken,
    payload,
    createOrder,
    createProduct,
    createCompany,
    createAdmin,
     orderdata = {
        orderId:"1",
        companyId:"",
        clientId:"",
        item:[]
    }, 
    admindata = {
        username: "lpks",
        password: "12345678",
        mobile: "1234567890",
        role:'admin'
    },
     companydata = {
        ordername:"devankumar",
        address:"india",
        mobile:"1234567891",
        slug:"devanku",
        owner:"lakshmi"
    },clientdata = {
        clientname:"devankumar",
        address:"india",
        mobile:"1234567891"
    },
     productdata = {
        productname:"devankumar",
        code:"india",
        orderSlug:"",
        item:[{

        }]
    },
   
    cookie,req,res,
   validationrequireError=[ {"companyId": "Company Name is required"},
                             {"clientId": "Client Name is required"}
                          ]
    beforeEach(async()=>{
            
            password = await generatepassword(admindata.password)
            createdata =  await adminschema.create({...admindata,password});
            payload ={adminid:{id:createdata._id,role:createdata.role}}
            accesstoken = generateAccessToken(payload)
            refreshtoken = generateRefreshToken(payload)
            createdata =  await adminschema.findOneAndUpdate({_id:createdata?.id},{$set:{refreshtoken}},{upsert:true})
            cookie = [`accessToken=${accesstoken}`,`refreshToken=${refreshtoken}`]
            createCompany = await companyschema.create(companydata)
            productdata.companySlug=createCompany?.id
            
            createProduct = await productschema.create(productdata)
            createClient = await clientschema.create(clientdata)
            orderdata.companyId=productdata.companySlug,
            orderdata.clientId=createClient.id,
            orderdata.item=[{
                productId:createProduct.id
            }]      
            createOrder = await orderschema.create(orderdata)
            
            req = {};
            res = {
                status:jest.fn().mockReturnThis(),
                json:jest.fn(),
                cookie:jest.fn(),
                body:jest.fn(),
                clearCookie:jest.fn()
            },
                next=jest.fn()

    
    })
    describe("=====Add Module=====",()=>{
        test("should add the order data",async()=>{
            req.body = orderdata
            await orderService.add.mockResolvedValue(orderdata)
            await orderController.add(req,res);
            expect(orderService.add).toHaveBeenCalledWith(orderdata)
            expect(res.status).toHaveBeenCalledWith(Created);
        })
       
       
    })
    
    describe("=====List all order Module=====",()=>{
        test("should list all the order data",async()=>{
            await orderService.list.mockResolvedValue()
            await orderController.list(req,res);
            expect(orderService.list).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(ok);
           })
       
    })
    describe("=====List  order Module=====",()=>{
        test("should list particular the order data",async()=>{
            
            req.params={id:createOrder.id}
            await orderService.profile.mockResolvedValue(req.params.id)
            await orderController.profile(req,res);
            expect(orderService.profile).toHaveBeenCalledWith(req.params.id)
            expect(res.status).toHaveBeenCalledWith(ok);
           })
       
    })
    describe("=====Delete  order Module=====",()=>{
        test("should delete particular the order data",async()=>{
            
            req.params={id:createOrder.id}
            await orderService.delete.mockResolvedValue(req.params.id)
            await orderController.delete(req,res);
            expect(orderService.delete).toHaveBeenCalledWith(req.params.id)
            expect(res.status).toHaveBeenCalledWith(deleted);
        })
        test(`should throw ${unauthoizedUser} while delete particular the order data`,async()=>{

            orderService.delete.mockRejectedValue(
                new AppError(unauthoizedUser,Unauthorized,[{error:unauthoizedUser}])                  
            )
            await expect(
                 orderController.delete(req,res,next)
            ).rejects.toThrow(unauthoizedUser)
        })   
             
    })
    describe("=====Edit  order Module=====",()=>{
        test("should edit particular the order data",async()=>{
            
            req.params={id:createOrder.id}
            req.body=orderdata
            await orderService.edit.mockResolvedValue(req.body,req.params.id)
            await orderController.edit(req,res);
            expect(orderService.edit).toHaveBeenCalledWith(req.body,req.params.id)
            expect(res.status).toHaveBeenCalledWith(Created);
        })
        test(`should throw ${failedToUpdate} while edit particular the order data`,async()=>{
            
            
            orderService.edit.mockRejectedValue(
                new AppError(failedToUpdate,badRequest,[{error:failedToUpdate}] )                  
            )
            await expect(
                 orderController.edit(req,res)
            ).rejects.toThrow(failedToUpdate)
        })   
        test("should throw mobile number exist error while edit the order data",async()=>{
             orderService.edit.mockRejectedValue(
               new AppError(mobileConflict, Conflict, [{ mobile: mobileConflict }])
            );

            await expect(
               orderController.edit(req, res, next)
            ).rejects.toThrow(mobileConflict);
        })
              
    })
})