const mongoose = require('mongoose');

async function connectMongoDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/bank-account', {
      useNewUrlParser: true,
    });
    // await mongoose.connect("mongodb+srv://ohad:ppd53brx!@cluster0-vw61b.mongodb.net/transcationr?retryWrites=true", {
    //     useNewUrlParser: true
    // })
    console.log('MongoDB is on, connection successfully!');
  } catch (error) {
    console.log(error);
  }
}


module.exports = {

  connectMongoDB,
};
