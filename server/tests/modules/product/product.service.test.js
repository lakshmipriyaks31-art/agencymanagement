const productService = require('../../../src/modules/product/product.service')
const productschema = require('../../../src/modules/product/product.model')
const {  mobileConflict,noUserFound,  unauthoizedUser,  failedToUpdate, productConflict } = require('../../../src/config/env')
const AppError = require('../../../src/utils/appError')

jest.mock('../../../src/modules/product/product.model')

describe("----------Product Controller--------",()=>{
    let  productid="product123",
    senddata ={
        _id:productid,
        productname:"devankumar",
        code:"india",
        companySlug:"",
        item:[{

        }]
    }
    beforeEach(async()=>{              
                
               
    })
    describe("=====Add Module=====",()=>{
        test("should add the product data",async()=>{
                productschema.findOne.mockResolvedValue(null);
                const saveMock = jest.fn().mockResolvedValue(senddata);
                productschema.mockImplementation(() => ({
                    id: productid,
                    save: saveMock
                }));

                const result = await productService.add(senddata);

                expect(productschema.findOne).toHaveBeenCalledWith({
                    code:senddata.code,
                    companySlug:senddata.companySlug ,
                    isDeleted:false
                });

                expect(result).toEqual(senddata);
        })
        test(`should throw ${productConflict} error while add the product data`,async()=>{
            
                productschema.findOne.mockResolvedValue(true);
                await expect(
                    productService.add(senddata)
                ).rejects.toBeInstanceOf(AppError);         
        })
        
    })

    describe("=====List all Product Module=====",()=>{
        test("should list all the product data",async()=>{
            productschema.find.mockReturnValue(
               { 
                select:jest.fn().mockReturnValue({
                    sort:jest.fn().mockResolvedValue(senddata)
                })
               }
            )
            var result =await productService.list()
            expect(productschema.find).toHaveBeenCalledWith(
                {isDeleted:false}
            )
            expect(result).toBe(senddata);
        }) 
    })

    describe("=====List particular Product Module=====",()=>{
        test("should list particular the product data",async()=>{
            
            productschema.findOne.mockReturnValue({
                    select:jest.fn().mockResolvedValue(senddata)
                })
            
            const result = await productService.profile(senddata._id)
            expect(productschema.findOne).toHaveBeenCalledWith(
                {
                    _id:senddata._id,
                    isDeleted:false
                }
            )
            expect(result).toEqual(senddata);
        })
       
        test(`should throw ${"Product not found"} error while logout the product data`,async()=>{
            
            productschema.findOne.mockReturnValue({
                    select:jest.fn().mockResolvedValue(false)
                })
            
            await expect(
               productService.profile()
            ).rejects.toBeInstanceOf(AppError);

        })
       
    })

    describe("=====Delete  Product Module=====",()=>{
        test("should delete particular the product data",async()=>{
            
            productschema.findOneAndUpdate.mockResolvedValue(true)
            const result = await productService.delete(senddata._id)
            expect(productschema.findOneAndUpdate).toHaveBeenCalledWith(
                {_id:senddata?._id},
                {$set:{isDeleted:true}},
                {upsert:true}
            )
            expect(result).toEqual("ok")
        })
        
        test(`should throw ${unauthoizedUser} error while delete the product data`,async()=>{
            
            productschema.findOneAndUpdate.mockResolvedValue(false)
            await expect(
               productService.delete()
            ).rejects.toBeInstanceOf(AppError);
        })
       
    })

    describe("=====Edit  Product Module=====",()=>{
        test("should edit particular the product data",async()=>{
            
            productschema.findOne.mockResolvedValue(false)
            productschema.findOneAndUpdate.mockReturnValue(
                {
                select:jest.fn().mockResolvedValue(senddata)
                }
            )
            const result = await productService.edit(senddata,productid)
            expect(productschema.findOneAndUpdate).toHaveBeenCalledWith(
                {
                 _id:productid
                },
                {$set:
                    senddata
                },
                {upsert:true}
            )
             expect(result).toEqual(senddata)
        })

        test(`should throw ${failedToUpdate} while edit particular the product data`,async()=>{
            productschema.findOne.mockResolvedValue(false)
            productschema.findOneAndUpdate.mockReturnValue(
                {
                select:jest.fn().mockResolvedValue(false)
                }
            )                   
            await expect(
                 productService.edit(senddata)
           ).rejects.toBeInstanceOf(AppError);
        })   

        test("should throw mobile number exist error while edit the product data",async()=>{
            productschema.findOne.mockResolvedValue(true)
                            
            await expect(
                 productService.edit(senddata)
            ).rejects.toBeInstanceOf(AppError);
        })
      
    })
})