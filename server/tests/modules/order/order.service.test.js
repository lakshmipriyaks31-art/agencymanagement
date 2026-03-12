const orderService = require('../../../src/modules/order/order.service')
const orderschema = require('../../../src/modules/order/order.model')
const {  mobileConflict,noUserFound,  unauthoizedUser,  failedToUpdate, orderConflict } = require('../../../src/config/env')
const AppError = require('../../../src/utils/appError')

jest.mock('../../../src/modules/order/order.model')

describe("----------Order Controller--------",()=>{
    let  orderid="order123",
    senddata ={
        _id:orderid,
        orderId:"1",
        companyId:"",
        clientId:"",
        item:[]
    }
    beforeEach(async()=>{              
                
               
    })
    describe("=====Add Module=====",()=>{
        test("should add the order data",async()=>{
                orderschema.find.mockReturnValue(
                    {
                        sort:jest.fn().mockReturnValue({
                            limit:jest.fn().mockResolvedValue({})
                        })
                    }
                );
                const saveMock = jest.fn().mockResolvedValue(senddata);
                orderschema.mockImplementation(() => ({
                    id: orderid,
                    save: saveMock
                }));
                const result = await orderService.add(senddata);
                expect(orderschema.find).toHaveBeenCalledWith({});
                expect(result).toEqual(senddata);
        })
        
    })

    describe("=====List all Order Module=====",()=>{
        test("should list all the order data",async()=>{
            orderschema.find.mockReturnValue(
               { 
                populate:jest.fn().mockReturnValue({
                    populate:jest.fn().mockReturnValue({
                        select:jest.fn().mockReturnValue({
                            sort:jest.fn().mockResolvedValue(senddata)
                        })
                    })
                })
               }
            )
            var result =await orderService.list()
            expect(orderschema.find).toHaveBeenCalledWith(
                {isDeleted:false}
            )
            expect(result).toBe(senddata);
        }) 
    })

    describe("=====List particular Order Module=====",()=>{
        test("should list particular the order data",async()=>{
            orderschema.findOne.mockReturnValue({
                populate:jest.fn().mockReturnValue({
                    populate:jest.fn().mockReturnValue({
                        populate:jest.fn().mockReturnValue({
                            select:jest.fn().mockResolvedValue(senddata)
                        })
                    })
                })
            })
            
            const result = await orderService.profile(senddata._id)
            expect(orderschema.findOne).toHaveBeenCalledWith(
                {
                    _id:senddata._id,
                    isDeleted:false
                }
            )
            expect(result).toEqual(senddata);
        })
       
        test(`should throw ${"Order not found"} error while logout the order data`,async()=>{
            
           orderschema.findOne.mockReturnValue({
                populate:jest.fn().mockReturnValue({
                    populate:jest.fn().mockReturnValue({
                        populate:jest.fn().mockReturnValue({
                            select:jest.fn().mockResolvedValue(false)
                           
                        })
                    })
                })
            })
                        
            await expect(
               orderService.profile(senddata._id)
            ).rejects.toBeInstanceOf(AppError);

        })
       
    })

    describe("=====Delete  Order Module=====",()=>{
        test("should delete particular the order data",async()=>{
            
            orderschema.findOneAndUpdate.mockResolvedValue(true)
            const result = await orderService.delete(senddata._id)
            expect(orderschema.findOneAndUpdate).toHaveBeenCalledWith(
                {_id:senddata?._id},
                {$set:{isDeleted:true}},
                {upsert:true}
            )
            expect(result).toEqual("ok")
        })
        
        test(`should throw ${unauthoizedUser} error while delete the order data`,async()=>{
            
            orderschema.findOneAndUpdate.mockResolvedValue(false)
            await expect(
               orderService.delete()
            ).rejects.toBeInstanceOf(AppError);
        })
       
    })

    describe("=====Edit  Order Module=====",()=>{
        test("should edit particular the order data",async()=>{
            
            orderschema.findOne.mockResolvedValue(false)
            orderschema.findOneAndUpdate.mockReturnValue(
                {
                select:jest.fn().mockResolvedValue(senddata)
                }
            )
            const result = await orderService.edit(senddata,orderid)
            expect(orderschema.findOneAndUpdate).toHaveBeenCalledWith(
                {
                 _id:orderid
                },
                {$set:
                    senddata
                },
                {upsert:true}
            )
             expect(result).toEqual(senddata)
        })

        test(`should throw ${failedToUpdate} while edit particular the order data`,async()=>{
            orderschema.findOne.mockResolvedValue(false)
            orderschema.findOneAndUpdate.mockReturnValue(
                {
                select:jest.fn().mockResolvedValue(false)
                }
            )                   
            await expect(
                 orderService.edit(senddata)
           ).rejects.toBeInstanceOf(AppError);
        })   

        test("should throw mobile number exist error while edit the order data",async()=>{
            orderschema.findOne.mockResolvedValue(true)
                            
            await expect(
                 orderService.edit(senddata)
            ).rejects.toBeInstanceOf(AppError);
        })
      
    })
})