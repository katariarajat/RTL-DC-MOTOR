const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        date : String,
        slots : [
            {
                slot: String,
            }
        ]
    }
);

// 0 - 1 => 1
// 1 - 2 => 2
// 2 - 3 => 3
module.exports = Session = mongoose.model("Sessions", UserSchema);

