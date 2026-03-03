class ApiResponse {
  static success(res, data, message = 'Success', status = 200) {
    console.log("res, data, message = 'Success', status = 20", data, message , status )
    return res.status(status).json({
      success: true,
      message:JSON.stringify(message),
      data,
    });
  }
}

module.exports = ApiResponse;