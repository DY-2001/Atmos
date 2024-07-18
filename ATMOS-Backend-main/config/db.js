require("dotenv").config();
const mongoose = require("mongoose");

const { MongoMemoryServer } = require("mongodb-memory-server");
let mongod = null;
let URI = process.env.MONGO_URI;

// console.log("Database ",URI)

mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    // console.log(process.env.NODE_ENV);
    // let envNode = (process.env.NODE_ENV || 'development');
    // console.log(URI);
    // console.log(envNode.length);
    // console.log(envNode)
    // if (envNode === 'test ') {
    //     // mongod = await MongoMemoryServer.create();
    //     // URI = process.env.MONGO_URI_TEST;
    //     // URI = await mongod.getUri();
    //     // console.log(URI);
    // }
    await mongoose.connect(URI);
    // if (envNode === 'development') {
    console.log("ATMOS Database connected...");
    // }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// const connectTestDB = async () => {
//     try {

//             // mongod = await MongoMemoryServer.create();
//         URI = process.env.MONGO_URI_TEST;
//             // URI = await mongod.getUri();
//             console.log(URI);
//         await mongoose.connect(URI);
//     }
//     catch (err) {
//         console.error(err.message);
//         process.exit(1);
//     }
// }

const disconnectDB = async () => {
  try {
    // drop database
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = { connectDB, disconnectDB };
