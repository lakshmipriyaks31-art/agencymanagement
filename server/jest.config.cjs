// const path = require("path");

// module.exports = {
//   testEnvironment: "node",  
//   clearMocks: true,
//   setupFilesAfterEnv: [
//     path.resolve(__dirname, "tests/setup.js"),
//   ],
// };

module.exports= {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js"
  ],
};