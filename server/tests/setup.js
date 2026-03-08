const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const config = require('../src/config/env')
let mongoServer;
jest.setTimeout(30000); // 30 seconds
beforeAll(async () => {

  mongoServer = await MongoMemoryServer.create();

  const uri = mongoServer.getUri();
console.log("uri",uri)
  await mongoose.connect(`${uri}agency`);

});

afterAll(async () => {

  await mongoose.connection.close();

  await mongoServer.stop();

});

afterEach(async () => {

  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany();
  }

});