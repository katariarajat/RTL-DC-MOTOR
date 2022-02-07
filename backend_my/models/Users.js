const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: false,
    default: Date.now,
  },
  sessions : [
    {
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
      experiments : [
        {
          experimentsId : {
            type: String,
            required: true,
          },
        }
      ]
    }
  ]
});

module.exports = User = mongoose.model("Users", UserSchema);
