const productController = require('../../../src/modules/product/product.controller')
const productService = require('../../../src/modules/product/product.service')
const validationMiddleware = require('../../../src/middleware/validation.middleware')

const adminschema = require('../../../src/modules/admin/admin.model')
const companyschema = require('../../../src/modules/company/company.model')
const productschema = require('../../../src/modules/product/product.model')
const { generatepassword } = require('../../../src/utils/bcypt')
const { generateAccessToken, generateRefreshToken } = require('../../../src/utils/jwttoken')
const { Created, unprocessable_Entity, mobileConflict, Conflict, validationError, ok, noUserFound, invalidToken, Unauthorized, notFound, commonId, unauthoizedUser, deleted, failedToUpdate, badRequest } = require('../../../src/config/env')
const AppError = require('../../../src/utils/appError')

jest.mock('../../../src/modules/product/product.service')
jest.mock('../../../src/middleware/validation.middleware')
describe("----------product Controller--------",()=>{
    let createdata,
    accesstoken,
    refreshtoken,
    payload,
    createProduct,
     createCompany,
    admindata = {
        username: "lpks",
        password: "12345678",
        mobile: "1234567890",
        role:'admin'
    },
      productdata = {
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
    cookie,req,res,
   validationrequireError=[  {"productname": "Product Name is required"}, 
                    {"productname": "Product Name must be at least 3 characters"}, {"owner": "Owner Name is required"}, 
                    {"owner": "Owner Name must be at least 3 characters"}, 
                    {"mobile": "Mobile is required"}, 
                    {"slug": "Slug is required"}, 
                    {"mobile": "Mobile number must be 10 numbers"}
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
        test("should add the product data",async()=>{
            req.body = productdata
            await productService.add.mockResolvedValue(productdata)
            await productController.add(req,res);
            expect(productService.add).toHaveBeenCalledWith(productdata)
            expect(res.status).toHaveBeenCalledWith(Created);
        })
        test("should throw mobile number exist error while add the product data",async()=>{
             productService.add.mockRejectedValue(
               new AppError(mobileConflict, Conflict, [{ mobile: mobileConflict }])
            );

            await expect(
               productController.add(req, res, next)
            ).rejects.toThrow(mobileConflict);
        })
        test("should throw validation error",async()=>{
             productService.add.mockRejectedValue(
               new AppError(validationError, unprocessable_Entity, validationrequireError)
            );

            await expect(
               productController.add(req, res, next)
            ).rejects.toThrow(validationError)
           
        })
        test(`should throw ${invalidToken} error while list all the product data`,async()=>{
             productService.add.mockRejectedValue(
               new AppError(invalidToken, Unauthorized, [{ error: invalidToken }])
            );

            await expect(
               productController.add(req, res, next)
            ).rejects.toThrow(invalidToken);
        })
    })
    
    describe("=====List all product Module=====",()=>{
        test("should list all the product data",async()=>{
            // req.body = {mobile:productdata.mobile,password:productdata.password}
            // req.product = payload 
            await productService.list.mockResolvedValue()
            await productController.list(req,res);
            expect(productService.list).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(ok);
           })
       
        test(`should throw ${invalidToken} error while list all the product data`,async()=>{
             productService.list.mockRejectedValue(
               new AppError(invalidToken, Unauthorized, [{ error: invalidToken }])
            );

            await expect(
               productController.list(req, res, next)
            ).rejects.toThrow(invalidToken);
        })
       
    })
    describe("=====List  product Module=====",()=>{
        test("should list particular the product data",async()=>{
            
            req.params={id:createProduct.id}
            await productService.profile.mockResolvedValue(req.params.id)
            await productController.profile(req,res);
            expect(productService.profile).toHaveBeenCalledWith(req.params.id)
            expect(res.status).toHaveBeenCalledWith(ok);
           })
       
        test(`should throw ${invalidToken} error while list the product data`,async()=>{
             productService.profile.mockRejectedValue(
               new AppError(invalidToken, Unauthorized, [{ error: invalidToken }])
            );

            await expect(
               productController.profile(req, res, next)
            ).rejects.toThrow(invalidToken);
        })
       
    })
    describe("=====Delete  product Module=====",()=>{
        test("should delete particular the product data",async()=>{
            
            req.params={id:createProduct.id}
            await productService.delete.mockResolvedValue(req.params.id)
            await productController.delete(req,res);
            expect(productService.delete).toHaveBeenCalledWith(req.params.id)
            expect(res.status).toHaveBeenCalledWith(deleted);
        })
        test(`should throw ${unauthoizedUser} while delete particular the product data`,async()=>{

            productService.delete.mockRejectedValue(
                new AppError(unauthoizedUser,Unauthorized,[{error:unauthoizedUser}])                  
            )
            await expect(
                 productController.delete(req,res,next)
            ).rejects.toThrow(unauthoizedUser)
        })   
       
        test(`should throw ${invalidToken} error while delete the product data`,async()=>{
            
            productService.delete.mockRejectedValue(
               new AppError(invalidToken, Unauthorized, [{ error: invalidToken }])
            );

            await expect(
               productController.delete(req, res, next)
            ).rejects.toThrow(invalidToken);
        })
       
    })
    describe("=====Edit  product Module=====",()=>{
        test("should edit particular the product data",async()=>{
            
            req.params={id:createProduct.id}
            req.body=productdata
            await productService.edit.mockResolvedValue(req.body,req.params.id)
            await productController.edit(req,res);
            expect(productService.edit).toHaveBeenCalledWith(req.body,req.params.id)
            expect(res.status).toHaveBeenCalledWith(Created);
        })
        test(`should throw ${failedToUpdate} while edit particular the product data`,async()=>{
            
            
            productService.edit.mockRejectedValue(
                new AppError(failedToUpdate,badRequest,[{error:failedToUpdate}] )                  
            )
            await expect(
                 productController.edit(req,res)
            ).rejects.toThrow(failedToUpdate)
        })   
        test("should throw mobile number exist error while edit the product data",async()=>{
             productService.edit.mockRejectedValue(
               new AppError(mobileConflict, Conflict, [{ mobile: mobileConflict }])
            );

            await expect(
               productController.edit(req, res, next)
            ).rejects.toThrow(mobileConflict);
        })
        test("should throw validation error",async()=>{
             productService.edit.mockRejectedValue(
               new AppError(validationError, unprocessable_Entity, validationrequireError)
            );

            await expect(
               productController.edit(req, res, next)
            ).rejects.toThrow(validationError)
           
        })
        test(`should throw ${invalidToken} error while edit the product data`,async()=>{
            
            productService.edit.mockRejectedValue(
               new AppError(invalidToken, Unauthorized, [{ error: invalidToken }])
            );

            await expect(
               productController.edit(req, res, next)
            ).rejects.toThrow(invalidToken);
        })
       
    })
})