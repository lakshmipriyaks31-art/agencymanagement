class ApiResponse {
  static success(res, data, message = 'Success', status = 200) {
    console.log("coming wrong here while got error")
    return res.status(status).json({
      success: true,
      message:JSON.stringify(message),
      data,
    });
  }
}

module.exports = ApiResponse;