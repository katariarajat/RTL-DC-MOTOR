const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        date : String,
        slots : [String]
    }
);

module.exports = Session = mongoose.model("Sessions", UserSchema);

