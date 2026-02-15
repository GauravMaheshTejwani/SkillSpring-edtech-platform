const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to MongoDB Successfully"))
    .catch((error) => {
        console.log("Error while connecting Mongo");
        console.error(error);
        process.exit(1);
    })
}