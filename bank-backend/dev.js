const mongoose = require('mongoose');

async function connectMongoDB() {

    try {
        await mongoose.connect("mongodb+srv://ohad:ppd53brx!@cluster0-vw61b.mongodb.net/transcationr?retryWrites=true", {
            useNewUrlParser: true
        })
        console.log('Connected successfully!');
    } catch (error) {
        console.log(error);
    }
}




module.exports = {

    connectMongoDB
}