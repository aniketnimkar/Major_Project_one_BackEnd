const mongoose = require('mongoose')

// Access your MongoDB connection string from secrets
const mySecret = process.env['MongoDB']

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