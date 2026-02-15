const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    SubSection: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "SubSection",
        }
    ],
});

module.exports = mongoose.model("Section", sectionSchema);