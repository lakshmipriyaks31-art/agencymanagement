const adminController = require('../../../src/modules/admin/admin.controller')
const adminService = require('../../../src/modules/admin/admin.service')
const validationMiddleware = require('../../../src/middleware/validation.middleware')

const adminschema = require('../../../src/modules/admin/admin.model')
const { generatepassword } = require('../../../src/utils/bcypt')
const { generateAccessToken, generateRefreshToken } = require('../../../src/utils/jwttoken')
const { Created, unprocessable_Entity, mobileConflict, Conflict, validationError, ok, noUserFound, invalidToken, Unauthorized, notFound, commonId, unauthoizedUser, deleted, failedToUpdate, badRequest } = require('../../../src/config/env')
const AppError = require('../../../src/utils/appError')

jest.mock('../../../src/modules/admin/admin.service')
jest.mock('../../../src/middleware/validation.middleware')
describe("----------Admin Controller--------",()=>{
    let createdata,
    accesstoken,
    refreshtoken,
    payload,
    senddata ={
        username: "lpks",
        password: "12345678",
        mobile: "1234567890",
        role:'admin'
    },
    cookie,req,res
     beforeEach(async()=>{
            
            password = await generatepassword(senddata.password)
            createdata =  await adminschema.create({...senddata,password});
            payload ={adminid:{id:createdata._id,role:createdata.role}}
            accesstoken = generateAccessToken(payload)
            refreshtoken = generateRefreshToken(payload)
            createdata =  await adminschema.findOneAndUpdate({_id:createdata?.id},{$set:{refreshtoken}},{upsert:true})
            cookie = [`accessToken=${accesstoken}`,`refreshToken=${refreshtoken}`]
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
    describe("=====Register Module=====",()=>{
        test("should register the admin data",async()=>{
            req.body = senddata
            await adminService.register.mockResolvedValue(senddata)
            await adminController.register(req,res);
            expect(adminService.register).toHaveBeenCalledWith(senddata)
            expect(res.status).toHaveBeenCalledWith(Created);
        })
        test("should throw mobile number exist error while register the admin data",async()=>{
             adminService.register.mockRejectedValue(
               new AppError(mobileConflict, Conflict, [{ mobile: mobileConflict }])
            );

            await expect(
               adminController.register(req, res, next)
            ).rejects.toThrow(mobileConflict);
        })
    })

    describe("=====Login Module=====",()=>{
        test("should login the admin data",async()=>{
            req.body = {mobile:senddata.mobile,password:senddata.password}
            await adminService.login.mockResolvedValue(senddata)
            await adminController.login(req,res);
            expect(adminService.login).toHaveBeenCalledWith(req.body)
            expect(res.status).toHaveBeenCalledWith(ok);
        })

    })

    describe("===== logout Admin Module=====",()=>{
        test("should logout the admin data",async()=>{
            // req.body = {mobile:senddata.mobile,password:senddata.password}
            req.admin = payload 
            req.cookies = cookie
            await adminService.logout.mockResolvedValue(req.admin?.adminid?.id,req.cookies.refreshToken)
            await adminController.logout(req,res);
            expect(adminService.logout).toHaveBeenCalledWith(req.admin?.adminid?.id,req.cookies.refreshtoken)
            expect(res.status).toHaveBeenCalledWith(ok);
           
         })
        test(`should throw ${noUserFound} error while logout the admin data`,async()=>{
             adminService.logout.mockRejectedValue(
               new AppError(noUserFound, notFound, [{ error: noUserFound }])
            );

            await expect(
               adminController.logout(req, res, next)
            ).rejects.toThrow(noUserFound);
        })
            
    })

    describe("=====List all Admin Module=====",()=>{
        test("should list all the admin data",async()=>{
            // req.body = {mobile:senddata.mobile,password:senddata.password}
            // req.admin = payload 
            await adminService.list.mockResolvedValue()
            await adminController.list(req,res);
            expect(adminService.list).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(ok);
           }) 

    })
    describe("=====List  Admin Module=====",()=>{
        test("should list particular the admin data",async()=>{
            
            req.params={id:createdata.id}
            await adminService.profile.mockResolvedValue(req.params.id)
            await adminController.profile(req,res);
            expect(adminService.profile).toHaveBeenCalledWith(req.params.id)
            expect(res.status).toHaveBeenCalledWith(ok);
           })
         
    })
    describe("=====Delete  Admin Module=====",()=>{
        test("should delete particular the admin data",async()=>{
            
            req.params={id:createdata.id}
            await adminService.delete.mockResolvedValue(req.params.id)
            await adminController.delete(req,res);
            expect(adminService.delete).toHaveBeenCalledWith(req.params.id)
            expect(res.status).toHaveBeenCalledWith(deleted);
        })
        test(`should throw ${unauthoizedUser} while delete particular the admin data`,async()=>{

            adminService.delete.mockRejectedValue(
                new AppError(unauthoizedUser,Unauthorized,[{error:unauthoizedUser}])                  
            )
            await expect(
                 adminController.delete(req,res,next)
            ).rejects.toThrow(unauthoizedUser)
        })   

    })
    describe("=====Edit  Admin Module=====",()=>{
        test("should edit particular the admin data",async()=>{
            
            req.params={id:createdata.id}
            req.body=senddata
            await adminService.edit.mockResolvedValue(req.body,req.params.id)
            await adminController.edit(req,res);
            expect(adminService.edit).toHaveBeenCalledWith(req.body,req.params.id)
            expect(res.status).toHaveBeenCalledWith(Created);
        })
        test(`should throw ${failedToUpdate} while edit particular the admin data`,async()=>{
            
            
            adminService.edit.mockRejectedValue(
                new AppError(failedToUpdate,badRequest,[{error:failedToUpdate}] )                  
            )
            await expect(
                 adminController.edit(req,res)
            ).rejects.toThrow(failedToUpdate)
        })   
        test("should throw mobile number exist error while edit the admin data",async()=>{
             adminService.edit.mockRejectedValue(
               new AppError(mobileConflict, Conflict, [{ mobile: mobileConflict }])
            );

            await expect(
               adminController.edit(req, res, next)
            ).rejects.toThrow(mobileConflict);
        })
       
    })
})