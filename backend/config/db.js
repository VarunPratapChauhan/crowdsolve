const mongoose = require('mongoose')

const connectDB = (con) =>{
    return mongoose.connect(con).then(() =>{
        console.log("MongoDB connected");
    }).catch((err) =>{
        console.log("database error :",err);
    })
}

module.exports = connectDB