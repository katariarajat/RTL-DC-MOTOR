const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        email: {
          type: String,
          required: true,
        },
        sessionDate : {
          type: String,
          required: true,
        },
        sessionStartTime : {
          type: String,
          required: true
        },
        sessionEndTime : {
          type : String,
          required: true,
        },
        experiments : [String],
    }
);

// 0 - 1 => 1
// 1 - 2 => 2
// 2 - 3 => 3
module.exports = Usersessions = mongoose.model("UserSessions", UserSchema);
module.exports = Usersessions = mongoose.model("UserSessions", UserSchema);
