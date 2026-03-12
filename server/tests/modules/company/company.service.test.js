const companyService = require('../../../src/modules/company/company.service')
const companyschema = require('../../../src/modules/company/company.model')
const { generatepassword, comparePassword } = require('../../../src/utils/bcypt')
const { generateAccessToken, generateRefreshToken } = require('../../../src/utils/jwttoken')
const {  mobileConflict,noUserFound,  unauthoizedUser,  failedToUpdate } = require('../../../src/config/env')
const AppError = require('../../../src/utils/appError')

jest.mock('../../../src/modules/company/company.model')

describe("----------Company Controller--------",()=>{
    let  companyid="company123",
    senddata ={
        _id:companyid,
        companyname:"devankumar",
        address:"india",
        mobile:"1234567891",
        slug:"devanku",
        owner:"lakshmi"
    }
    beforeEach(async()=>{              
                
               
    })
    describe("=====Add Module=====",()=>{
        test("should add the company data",async()=>{
                companyschema.findOne.mockResolvedValue(null);
                const saveMock = jest.fn().mockResolvedValue(senddata);
                companyschema.mockImplementation(() => ({
                    id: companyid,
                    save: saveMock
                }));

                const result = await companyService.add(senddata);

                expect(companyschema.findOne).toHaveBeenCalledWith({
                    slug: senddata.slug,
                    isDeleted: false
                });

                expect(result).toEqual(senddata);
        })
        test("should throw slug  exist error while add the company data",async()=>{
            
                companyschema.findOne.mockResolvedValue(true);
                await expect(
                    companyService.add(senddata)
                ).rejects.toBeInstanceOf(AppError);         
        })
        
    })

    describe("=====List all Company Module=====",()=>{
        test("should list all the company data",async()=>{
            companyschema.find.mockReturnValue(
               { 
                select:jest.fn().mockReturnValue({
                    sort:jest.fn().mockResolvedValue(senddata)
                })
               }
            )
            var result =await companyService.list()
            expect(companyschema.find).toHaveBeenCalledWith(
                {isDeleted:false}
            )
            expect(result).toBe(senddata);
        }) 
    })

    describe("=====List particular Company Module=====",()=>{
        test("should list particular the company data",async()=>{
            
            companyschema.findOne.mockReturnValue({
                populate:jest.fn().mockReturnValue({
                    select:jest.fn().mockResolvedValue(senddata)
                })
            })
            const result = await companyService.profile(senddata._id)
            expect(companyschema.findOne).toHaveBeenCalledWith(
                {
                    _id:senddata._id,
                    isDeleted:false
                }
            )
            expect(result).toEqual(senddata);
        })
       
        test(`should throw ${noUserFound} error while logout the company data`,async()=>{
            
            companyschema.findOne.mockReturnValue({
               populate:jest.fn().mockReturnValue({
                    select:jest.fn().mockResolvedValue(false)
                })
            })
            await expect(
               companyService.profile()
            ).rejects.toBeInstanceOf(AppError);

        })
       
    })

    describe("=====Delete  Company Module=====",()=>{
        test("should delete particular the company data",async()=>{
            
            companyschema.findOneAndUpdate.mockResolvedValue(true)
            const result = await companyService.delete(senddata._id)
            expect(companyschema.findOneAndUpdate).toHaveBeenCalledWith(
                {_id:senddata?._id},
                {$set:{isDeleted:true}},
                {upsert:true}
            )
            expect(result).toEqual("ok")
        })
        
        test(`should throw ${unauthoizedUser} error while delete the company data`,async()=>{
            
            companyschema.findOneAndUpdate.mockResolvedValue(false)
            await expect(
               companyService.delete()
            ).rejects.toBeInstanceOf(AppError);
        })
       
    })

    describe("=====Edit  Company Module=====",()=>{
        test("should edit particular the company data",async()=>{
            
            companyschema.findOne.mockResolvedValue(false)
            companyschema.findOneAndUpdate.mockReturnValue(
                {
                select:jest.fn().mockResolvedValue(senddata)
                }
            )
            const result = await companyService.edit(senddata,companyid)
            expect(companyschema.findOneAndUpdate).toHaveBeenCalledWith(
                {
                 _id:companyid
                },
                {$set:
                    senddata
                },
                {upsert:true}
            )
             expect(result).toEqual(senddata)
        })

        test(`should throw ${failedToUpdate} while edit particular the company data`,async()=>{
            companyschema.findOne.mockResolvedValue(false)
            companyschema.findOneAndUpdate.mockReturnValue(
                {
                select:jest.fn().mockResolvedValue(false)
                }
            )                   
            await expect(
                 companyService.edit(senddata)
           ).rejects.toBeInstanceOf(AppError);
        })   

        test("should throw mobile number exist error while edit the company data",async()=>{
            companyschema.findOne.mockResolvedValue(true)
                            
            await expect(
                 companyService.edit(senddata)
            ).rejects.toBeInstanceOf(AppError);
        })
      
    })
})