const mongoose = require("mongoose");

// require("dotenv").config({ path: "./KEYS.env" });
require("dotenv").config({ path: "./KEYS.env" });

// Access your MongoDB connection string from secrets
const mySecret = process.env.MONGO_Connection_String;

const intializeDatabase = async () => {
  try {
    const connection = await mongoose.connect(mySecret, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (connection) {
      console.log("Connected Successfully");
    }
  } catch (error) {
    console.log("Connection Failed", error);
  }
};

module.exports = { intializeDatabase };
