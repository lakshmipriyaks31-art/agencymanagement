const clientController = require('../../../src/modules/client/client.controller')
const clientService = require('../../../src/modules/client/client.service')
const adminschema = require('../../../src/modules/admin/admin.model')
const clientschema = require('../../../src/modules/client/client.model')
const { generatepassword } = require('../../../src/utils/bcypt')
const { generateAccessToken, generateRefreshToken } = require('../../../src/utils/jwttoken')
const { Created, unprocessable_Entity, mobileConflict, Conflict, validationError, ok, noUserFound, invalidToken, Unauthorized, notFound, commonId, unauthoizedUser, deleted, failedToUpdate, badRequest } = require('../../../src/config/env')
const AppError = require('../../../src/utils/appError')

jest.mock('../../../src/modules/client/client.service')
jest.mock('../../../src/middleware/validation.middleware')
describe("----------client Controller--------",()=>{
    let createdata,
    accesstoken,
    refreshtoken,
    payload,
    createClient,
    admindata = {
        username: "lpks",
        password: "12345678",
        mobile: "1234567890",
        role:'admin'
    },
    senddata ={
         clientname:"devankumar",
        address:"india",
        mobile:"1234567891"
       
    },
    cookie,req,res,
   
    validationrequireError=[
                { "clientname": "Client Name is required" },
                { "mobile": "Mobile is required" }
                ]
    beforeEach(async()=>{
            
            password = await generatepassword(admindata.password)
            createdata =  await adminschema.create({...admindata,password});
            payload ={adminid:{id:createdata._id,role:createdata.role}}
            accesstoken = generateAccessToken(payload)
            refreshtoken = generateRefreshToken(payload)
            createdata =  await adminschema.findOneAndUpdate({_id:createdata?.id},{$set:{refreshtoken}},{upsert:true})
            cookie = [`accessToken=${accesstoken}`,`refreshToken=${refreshtoken}`]
            createClient = await clientschema.create(senddata)
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
        test("should add the client data",async()=>{
            req.body = senddata
            await clientService.add.mockResolvedValue(senddata)
            await clientController.add(req,res);
            expect(clientService.add).toHaveBeenCalledWith(senddata)
            expect(res.status).toHaveBeenCalledWith(Created);
        })
        test("should throw mobile number exist error while add the client data",async()=>{
             clientService.add.mockRejectedValue(
               new AppError(mobileConflict, Conflict, [{ mobile: mobileConflict }])
            );

            await expect(
               clientController.add(req, res, next)
            ).rejects.toThrow(mobileConflict);
        })
    })
    
    describe("=====List all client Module=====",()=>{
        test("should list all the client data",async()=>{
            await clientService.list.mockResolvedValue()
            await clientController.list(req,res);
            expect(clientService.list).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(ok);
        })       
    })

    describe("=====List  client Module=====",()=>{
        test("should list particular the client data",async()=>{
            
            req.params={id:createClient.id}
            await clientService.profile.mockResolvedValue(req.params.id)
            await clientController.profile(req,res);
            expect(clientService.profile).toHaveBeenCalledWith(req.params.id)
            expect(res.status).toHaveBeenCalledWith(ok);
        })    
    })

    describe("=====Delete  client Module=====",()=>{
        test("should delete particular the client data",async()=>{
            
            req.params={id:createClient.id}
            await clientService.delete.mockResolvedValue(req.params.id)
            await clientController.delete(req,res);
            expect(clientService.delete).toHaveBeenCalledWith(req.params.id)
            expect(res.status).toHaveBeenCalledWith(deleted);
        })
        test(`should throw ${unauthoizedUser} while delete particular the client data`,async()=>{

            clientService.delete.mockRejectedValue(
                new AppError(unauthoizedUser,Unauthorized,[{error:unauthoizedUser}])                  
            )
            await expect(
                 clientController.delete(req,res,next)
            ).rejects.toThrow(unauthoizedUser)
        })  
    })

    describe("=====Edit  client Module=====",()=>{
        test("should edit particular the client data",async()=>{
            
            req.params={id:createClient.id}
            req.body=senddata
            await clientService.edit.mockResolvedValue(req.body,req.params.id)
            await clientController.edit(req,res);
            expect(clientService.edit).toHaveBeenCalledWith(req.body,req.params.id)
            expect(res.status).toHaveBeenCalledWith(Created);
        })
        test(`should throw ${failedToUpdate} while edit particular the client data`,async()=>{
            
            
            clientService.edit.mockRejectedValue(
                new AppError(failedToUpdate,badRequest,[{error:failedToUpdate}] )                  
            )
            await expect(
                 clientController.edit(req,res)
            ).rejects.toThrow(failedToUpdate)
        })   
        test("should throw mobile number exist error while edit the client data",async()=>{
             clientService.edit.mockRejectedValue(
               new AppError(mobileConflict, Conflict, [{ mobile: mobileConflict }])
            );

            await expect(
               clientController.edit(req, res, next)
            ).rejects.toThrow(mobileConflict);
        })
             
    })
})