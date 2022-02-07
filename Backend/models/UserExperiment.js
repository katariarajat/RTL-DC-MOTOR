const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
const UserSchema = new Schema(
   {
       experimentData: [
         {
          Voltage: String,
          RPM : String,
          Avg_Current : String,
          TheoriticalRpm : String,
          }
         ],
         time : String,
         description : String,
   }
);
 
module.exports = Userexperiment = mongoose.model("UserExperiment", UserSchema);
