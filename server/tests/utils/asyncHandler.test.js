const asyncHandler = require('../../src/utils/asyncHandler')

describe("asyncHandler Utility",()=>{
     test("should call the function successfully without calling next", async () => {
        
    const mockFn = jest.fn().mockResolvedValue("Success");
    const next = jest.fn();
    const asynchandle =  asyncHandler(mockFn)
      await asynchandle({}, {}, next);
       expect(mockFn).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
})
    test("should call the function next with error",async()=>{
        const error = new Error("Something failed")
        const mockFn = jest.fn().mockRejectedValue(error)
        const next = jest.fn();
        const handler = asyncHandler(mockFn)
       await handler({},{},next)
        expect(next).toHaveBeenCalledWith(error)
    })
      
})