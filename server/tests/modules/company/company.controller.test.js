const companyController = require('../../../src/modules/company/company.controller')
const companyService = require('../../../src/modules/company/company.service')
const validationMiddleware = require('../../../src/middleware/validation.middleware')

const adminschema = require('../../../src/modules/admin/admin.model')
const companyschema = require('../../../src/modules/company/company.model')
const { generatepassword } = require('../../../src/utils/bcypt')
const { generateAccessToken, generateRefreshToken } = require('../../../src/utils/jwttoken')
const { Created, unprocessable_Entity, mobileConflict, Conflict, validationError, ok, noUserFound, invalidToken, Unauthorized, notFound, commonId, unauthoizedUser, deleted, failedToUpdate, badRequest } = require('../../../src/config/env')
const AppError = require('../../../src/utils/appError')

jest.mock('../../../src/modules/company/company.service')
jest.mock('../../../src/middleware/validation.middleware')
describe("----------company Controller--------",()=>{
    let createdata,
    accesstoken,
    refreshtoken,
    payload,
    createCompany,
    admindata = {
        username: "lpks",
        password: "12345678",
        mobile: "1234567890",
        role:'admin'
    },
     companydata = {
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
   
    cookie,req,res,
   validationrequireError=[  {"companyname": "Company Name is required"}, 
                    {"companyname": "Company Name must be at least 3 characters"}, {"owner": "Owner Name is required"}, 
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
        test("should add the company data",async()=>{
            req.body = companydata
            await companyService.add.mockResolvedValue(companydata)
            await companyController.add(req,res);
            expect(companyService.add).toHaveBeenCalledWith(companydata)
            expect(res.status).toHaveBeenCalledWith(Created);
        })
        test("should throw mobile number exist error while add the company data",async()=>{
             companyService.add.mockRejectedValue(
               new AppError(mobileConflict, Conflict, [{ mobile: mobileConflict }])
            );

            await expect(
               companyController.add(req, res, next)
            ).rejects.toThrow(mobileConflict);
        })
        test("should throw validation error",async()=>{
             companyService.add.mockRejectedValue(
               new AppError(validationError, unprocessable_Entity, validationrequireError)
            );

            await expect(
               companyController.add(req, res, next)
            ).rejects.toThrow(validationError)
           
        })
        test(`should throw ${invalidToken} error while list all the company data`,async()=>{
             companyService.add.mockRejectedValue(
               new AppError(invalidToken, Unauthorized, [{ error: invalidToken }])
            );

            await expect(
               companyController.add(req, res, next)
            ).rejects.toThrow(invalidToken);
        })
    })
    
    describe("=====List all company Module=====",()=>{
        test("should list all the company data",async()=>{
            // req.body = {mobile:companydata.mobile,password:companydata.password}
            // req.company = payload 
            await companyService.list.mockResolvedValue()
            await companyController.list(req,res);
            expect(companyService.list).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(ok);
           })
       
        test(`should throw ${invalidToken} error while list all the company data`,async()=>{
             companyService.list.mockRejectedValue(
               new AppError(invalidToken, Unauthorized, [{ error: invalidToken }])
            );

            await expect(
               companyController.list(req, res, next)
            ).rejects.toThrow(invalidToken);
        })
       
    })
    describe("=====List  company Module=====",()=>{
        test("should list particular the company data",async()=>{
            
            req.params={id:createCompany.id}
            await companyService.profile.mockResolvedValue(req.params.id)
            await companyController.profile(req,res);
            expect(companyService.profile).toHaveBeenCalledWith(req.params.id)
            expect(res.status).toHaveBeenCalledWith(ok);
           })
       
        test(`should throw ${invalidToken} error while list the company data`,async()=>{
             companyService.profile.mockRejectedValue(
               new AppError(invalidToken, Unauthorized, [{ error: invalidToken }])
            );

            await expect(
               companyController.profile(req, res, next)
            ).rejects.toThrow(invalidToken);
        })
       
    })
    describe("=====Delete  company Module=====",()=>{
        test("should delete particular the company data",async()=>{
            
            req.params={id:createCompany.id}
            await companyService.delete.mockResolvedValue(req.params.id)
            await companyController.delete(req,res);
            expect(companyService.delete).toHaveBeenCalledWith(req.params.id)
            expect(res.status).toHaveBeenCalledWith(deleted);
        })
        test(`should throw ${unauthoizedUser} while delete particular the company data`,async()=>{

            companyService.delete.mockRejectedValue(
                new AppError(unauthoizedUser,Unauthorized,[{error:unauthoizedUser}])                  
            )
            await expect(
                 companyController.delete(req,res,next)
            ).rejects.toThrow(unauthoizedUser)
        })   
       
        test(`should throw ${invalidToken} error while delete the company data`,async()=>{
            
            companyService.delete.mockRejectedValue(
               new AppError(invalidToken, Unauthorized, [{ error: invalidToken }])
            );

            await expect(
               companyController.delete(req, res, next)
            ).rejects.toThrow(invalidToken);
        })
       
    })
    describe("=====Edit  company Module=====",()=>{
        test("should edit particular the company data",async()=>{
            
            req.params={id:createCompany.id}
            req.body=companydata
            await companyService.edit.mockResolvedValue(req.body,req.params.id)
            await companyController.edit(req,res);
            expect(companyService.edit).toHaveBeenCalledWith(req.body,req.params.id)
            expect(res.status).toHaveBeenCalledWith(Created);
        })
        test(`should throw ${failedToUpdate} while edit particular the company data`,async()=>{
            
            
            companyService.edit.mockRejectedValue(
                new AppError(failedToUpdate,badRequest,[{error:failedToUpdate}] )                  
            )
            await expect(
                 companyController.edit(req,res)
            ).rejects.toThrow(failedToUpdate)
        })   
        test("should throw mobile number exist error while edit the company data",async()=>{
             companyService.edit.mockRejectedValue(
               new AppError(mobileConflict, Conflict, [{ mobile: mobileConflict }])
            );

            await expect(
               companyController.edit(req, res, next)
            ).rejects.toThrow(mobileConflict);
        })
        test("should throw validation error",async()=>{
             companyService.edit.mockRejectedValue(
               new AppError(validationError, unprocessable_Entity, validationrequireError)
            );

            await expect(
               companyController.edit(req, res, next)
            ).rejects.toThrow(validationError)
           
        })
        test(`should throw ${invalidToken} error while edit the company data`,async()=>{
            
            companyService.edit.mockRejectedValue(
               new AppError(invalidToken, Unauthorized, [{ error: invalidToken }])
            );

            await expect(
               companyController.edit(req, res, next)
            ).rejects.toThrow(invalidToken);
        })
       
    })
})