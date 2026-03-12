const adminService = require('../../../src/modules/admin/admin.service')
const adminschema = require('../../../src/modules/admin/admin.model')
const { generatepassword, comparePassword } = require('../../../src/utils/bcypt')
const { generateAccessToken, generateRefreshToken } = require('../../../src/utils/jwttoken')
const {  mobileConflict,noUserFound,  unauthoizedUser,  failedToUpdate } = require('../../../src/config/env')
const AppError = require('../../../src/utils/appError')

jest.mock('../../../src/modules/admin/admin.model')
jest.mock('../../../src/utils/bcypt')
jest.mock('../../../src/utils/jwttoken')
describe("----------Admin Controller--------",()=>{
    let  hashpassowrd="hashedpassword",
    accesstoken="token123",
    refreshtoken="refresh123",
    adminid="admin123",
    senddata ={
        _id:adminid,
        username: "lpks",
        password: "12345678",
        mobile: "1234567890",
        role:'admin',
        createdAt:Date.now()
    }
    beforeEach(async()=>{              
                
                generatepassword.mockReturnValue(hashpassowrd);
                comparePassword.mockReturnValue(true);
                generateAccessToken.mockReturnValue(accesstoken);
                generateRefreshToken.mockReturnValue(refreshtoken);
 
    })
    describe("=====Register Module=====",()=>{
        test("should register the admin data",async()=>{
                adminschema.findOne.mockResolvedValue(null);
                const saveMock = jest.fn().mockResolvedValue(true);
                console.log("saveMock",saveMock)
                adminschema.mockImplementation(() => ({
                    id: adminid,
                    save: saveMock
                }));

                const result = await adminService.register(senddata);

                expect(adminschema.findOne).toHaveBeenCalledWith({
                    mobile: senddata.mobile,
                    isDeleted: false
                });

                expect(generatepassword).toHaveBeenCalled();
                expect(generateAccessToken).toHaveBeenCalled();
                expect(generateRefreshToken).toHaveBeenCalled();

                expect(result).toEqual({
                    token:accesstoken,
                    refreshtoken: refreshtoken,
                    username: senddata.username
                });
        })
        test("should throw mobile number exist error while register the admin data",async()=>{
            
                adminschema.findOne.mockResolvedValue(true);
                await expect(
                    adminService.register(senddata)
                ).rejects.toBeInstanceOf(AppError);
                await expect(
                    adminService.register(senddata)
                ).rejects.toThrow(mobileConflict);
         
        })
        
    })

    describe("=====Login Module=====",()=>{
        test("should login the admin data",async()=>{
            adminschema.findOne.mockResolvedValueOnce(senddata)
            adminschema.findOneAndUpdate.mockResolvedValueOnce(true)
            const result = await adminService.login(senddata)
            expect(adminschema.findOne).toHaveBeenCalledWith({
                    mobile: senddata.mobile,
                    isDeleted: false
            });
            expect(comparePassword).toHaveBeenCalled()
            expect(generateAccessToken).toHaveBeenCalled();
            expect(generateRefreshToken).toHaveBeenCalled();
            expect(adminschema.findOneAndUpdate).toHaveBeenCalledWith(
                {_id:adminid},
                {$set:{refreshtoken}},
                {upsert:true}
            );
            expect(result).toEqual({
                token:accesstoken,
                refreshtoken: refreshtoken
            });
        })
       
        test("should throw  error when user not found",async()=>{
            adminschema.findOne.mockResolvedValue(null)
            await expect(
                    adminService.login(senddata)
            ).rejects.toBeInstanceOf(AppError);
        })
        test("should throw invalid password error",async()=>{
            adminschema.findOne.mockResolvedValue(senddata)
            comparePassword.mockResolvedValue(false);
            expect(adminschema.findOne).toHaveBeenCalledWith({
                    mobile: senddata.mobile,
                    isDeleted: false
            });
            expect(comparePassword).toHaveBeenCalled()
            
            await expect(
                    adminService.login(senddata)
            ).rejects.toBeInstanceOf(AppError);
        })
    })

    describe("===== logout Admin Module=====",()=>{
        test("should logout the admin data",async()=>{
            adminschema.findOne.mockResolvedValue(senddata)
            adminschema.findOneAndUpdate.mockResolvedValue(true)
            const result = await adminService.logout(adminid,refreshtoken)
            expect(adminschema.findOne).toHaveBeenCalledWith(
                {
                    _id:adminid,
                    isDeleted:false,
                    refreshtoken
                }
            )
             expect(adminschema.findOneAndUpdate).toHaveBeenCalledWith(
                {_id:adminid},
                {$set:{refreshtoken:null}},
                {upsert:true}
            )
            expect(result).toBe(true)
         })
        test(`should throw ${noUserFound} error while logout the admin data`,async()=>{
            
            adminschema.findOne.mockResolvedValueOnce(false)
            await expect(
               adminService.logout()
            ).rejects.toBeInstanceOf(AppError);

        })
       
    })

    describe("=====List all Admin Module=====",()=>{
        test("should list all the admin data",async()=>{
            adminschema.find.mockReturnValue(
               { 
                select:jest.fn().mockReturnValue({
                    sort:jest.fn().mockResolvedValue(senddata)
                })
               }
            )
            var result =await adminService.list()
            expect(adminschema.find).toHaveBeenCalledWith(
                {isDeleted:false}
            )
            expect(result).toBe(senddata);
        }) 
    })

    describe("=====List  Admin Module=====",()=>{
        test("should list particular the admin data",async()=>{
            
            adminschema.findOne.mockReturnValue({
                select:jest.fn().mockResolvedValue(senddata)
            })
            const result = await adminService.profile(senddata._id)
            expect(adminschema.findOne).toHaveBeenCalledWith(
                {
                    _id:senddata._id,
                    isDeleted:false
                }
            )
            expect(result).toEqual(senddata);
        })
       
        test(`should throw ${noUserFound} error while logout the admin data`,async()=>{
            
            adminschema.findOne.mockReturnValue({
                select:jest.fn().mockResolvedValue(false)
            })
            await expect(
               adminService.profile()
            ).rejects.toBeInstanceOf(AppError);

        })
       
    })

    describe("=====Delete  Admin Module=====",()=>{
        test("should delete particular the admin data",async()=>{
            
            adminschema.findOneAndUpdate.mockResolvedValue(true)
            const result = await adminService.delete(senddata._id)
            expect(adminschema.findOneAndUpdate).toHaveBeenCalledWith(
                {_id:senddata?._id},
                {$set:{isDeleted:true,refreshtoken:""}},
                {upsert:true}
            )
            expect(result).toEqual("ok")
        })
        
        test(`should throw ${unauthoizedUser} error while delete the admin data`,async()=>{
            
            adminschema.findOneAndUpdate.mockResolvedValue(false)
            await expect(
               adminService.delete()
            ).rejects.toBeInstanceOf(AppError);
        })
       
    })

    describe("=====Edit  Admin Module=====",()=>{
        test("should edit particular the admin data",async()=>{
            
            adminschema.findOne.mockResolvedValue(false)
            adminschema.findOneAndUpdate.mockReturnValue(
                {
                select:jest.fn().mockResolvedValue(senddata)
                }
            )
            generatepassword.mockReturnValue(hashpassowrd);
            const result = await adminService.edit(senddata,adminid)
            expect(adminschema.findOneAndUpdate).toHaveBeenCalledWith(
                {
                 _id:adminid
                },
                {$set:
                    senddata
                },
                {upsert:true}
            )
            expect(generatepassword).toHaveBeenCalled();
            expect(result).toEqual(senddata)
        })

        test(`should throw ${failedToUpdate} while edit particular the admin data`,async()=>{
            adminschema.findOne.mockResolvedValue(false)
            adminschema.findOneAndUpdate.mockReturnValue(
                {
                select:jest.fn().mockResolvedValue(false)
                }
            )                   
            await expect(
                 adminService.edit(senddata)
           ).rejects.toBeInstanceOf(AppError);
        })   

        test("should throw mobile number exist error while edit the admin data",async()=>{
            adminschema.findOne.mockResolvedValue(true)
                            
            await expect(
                 adminService.edit(senddata)
            ).rejects.toBeInstanceOf(AppError);
        })
      
    })
})