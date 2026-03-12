const clientService = require('../../../src/modules/client/client.service')
const clientschema = require('../../../src/modules/client/client.model')
const { generatepassword, comparePassword } = require('../../../src/utils/bcypt')
const { generateAccessToken, generateRefreshToken } = require('../../../src/utils/jwttoken')
const {  mobileConflict,noUserFound,  unauthoizedUser,  failedToUpdate } = require('../../../src/config/env')
const AppError = require('../../../src/utils/appError')

jest.mock('../../../src/modules/client/client.model')

describe("----------Client Controller--------",()=>{
    let clientid="client123",
    senddata ={
        _id:clientid,
          clientname:"devankumar",
        address:"india",
        mobile:"1234567891",
        createdAt:Date.now()
    }
    beforeEach(async()=>{              
                
               
    })
    describe("=====Add Module=====",()=>{
        test("should add the client data",async()=>{
                clientschema.findOne.mockResolvedValue(null);
                const saveMock = jest.fn().mockResolvedValue(senddata);
                clientschema.mockImplementation(() => ({
                    id: clientid,
                    save: saveMock
                }));

                const result = await clientService.add(senddata);

                expect(clientschema.findOne).toHaveBeenCalledWith({
                    mobile: senddata.mobile,
                    isDeleted: false
                });

                expect(result).toEqual(senddata);
        })
        test("should throw mobile number exist error while add the client data",async()=>{
            
                clientschema.findOne.mockResolvedValue(true);
                await expect(
                    clientService.add(senddata)
                ).rejects.toBeInstanceOf(AppError);         
        })
        
    })

    describe("=====List all Client Module=====",()=>{
        test("should list all the client data",async()=>{
            clientschema.find.mockReturnValue(
               { 
                select:jest.fn().mockReturnValue({
                    sort:jest.fn().mockResolvedValue(senddata)
                })
               }
            )
            var result =await clientService.list()
            expect(clientschema.find).toHaveBeenCalledWith(
                {isDeleted:false}
            )
            expect(result).toBe(senddata);
        }) 
    })

    describe("=====List particular Client Module=====",()=>{
        test("should list particular the client data",async()=>{
            
            clientschema.findOne.mockReturnValue({
                select:jest.fn().mockResolvedValue(senddata)
            })
            const result = await clientService.profile(senddata._id)
            expect(clientschema.findOne).toHaveBeenCalledWith(
                {
                    _id:senddata._id,
                    isDeleted:false
                }
            )
            expect(result).toEqual(senddata);
        })
       
        test(`should throw ${noUserFound} error while logout the client data`,async()=>{
            
            clientschema.findOne.mockReturnValue({
                select:jest.fn().mockResolvedValue(false)
            })
            await expect(
               clientService.profile()
            ).rejects.toBeInstanceOf(AppError);

        })
       
    })

    describe("=====Delete  Client Module=====",()=>{
        test("should delete particular the client data",async()=>{
            
            clientschema.findOneAndUpdate.mockResolvedValue(true)
            const result = await clientService.delete(senddata._id)
            expect(clientschema.findOneAndUpdate).toHaveBeenCalledWith(
                {_id:senddata?._id},
                {$set:{isDeleted:true}},
                {upsert:true}
            )
            expect(result).toEqual("ok")
        })
        
        test(`should throw ${unauthoizedUser} error while delete the client data`,async()=>{
            
            clientschema.findOneAndUpdate.mockResolvedValue(false)
            await expect(
               clientService.delete()
            ).rejects.toBeInstanceOf(AppError);
        })
       
    })

    describe("=====Edit  Client Module=====",()=>{
        test("should edit particular the client data",async()=>{
            
            clientschema.findOne.mockResolvedValue(false)
            clientschema.findOneAndUpdate.mockReturnValue(
                {
                select:jest.fn().mockResolvedValue(senddata)
                }
            )
            const result = await clientService.edit(senddata,clientid)
            expect(clientschema.findOneAndUpdate).toHaveBeenCalledWith(
                {
                 _id:clientid
                },
                {$set:
                    senddata
                },
                {upsert:true}
            )
             expect(result).toEqual(senddata)
        })

        test(`should throw ${failedToUpdate} while edit particular the client data`,async()=>{
            clientschema.findOne.mockResolvedValue(false)
            clientschema.findOneAndUpdate.mockReturnValue(
                {
                select:jest.fn().mockResolvedValue(false)
                }
            )                   
            await expect(
                 clientService.edit(senddata)
           ).rejects.toBeInstanceOf(AppError);
        })   

        test("should throw mobile number exist error while edit the client data",async()=>{
            clientschema.findOne.mockResolvedValue(true)
                            
            await expect(
                 clientService.edit(senddata)
            ).rejects.toBeInstanceOf(AppError);
        })
      
    })
})